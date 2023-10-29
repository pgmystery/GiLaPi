from bson import ObjectId
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder

from gilapi_api.db.utils.crud_model import CRUDModel
from gilapi_api.db.schemas.user import User as UserSchema, UserResponse, UserGitlabResponse
from gilapi_api.db.models.user import UserGitlab as UserGitlabModel, User as UserModel
from gilapi_api.db import crud


# https://fastapi.tiangolo.com/tutorial/sql-databases/
# https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/


class User(CRUDModel):
    def __init__(self, mongo_client=None):
        super().__init__("users", mongo_client=mongo_client)
        self.gitlab_crud = crud.gitlab.Gitlab(mongo_client=mongo_client)

    async def create(self, user: UserSchema):
        user_gitlabs = []
        response_gitlabs = []

        for gitlab in user.gitlabs:
            gitlab_db = await self.gitlab_crud.read(str(gitlab.url), "url")

            if gitlab_db is None:
                raise HTTPException(status_code=400, detail=f"The Gitlab with the URL'{gitlab.url}' is not added to GiLaPi")

            user_db = await self.db.find_one({
                "gitlabs": {
                    "id": gitlab_db.id,
                    "username": gitlab.username,
                }
            })

            if user_db is not None:
                raise HTTPException(status_code=400, detail=f"The username '{gitlab.username}' is already connected to an user-account")

            user_gitlabs.append(UserGitlabModel(
                id=gitlab_db.id,
                username=gitlab.username,
                gitlab_oauth_client_id=gitlab.gitlab_oauth_client_id,
            ))
            response_gitlabs.append(UserGitlabResponse(
                id=str(gitlab_db.id),
                name=gitlab_db.name,
                url=gitlab.url,
                username=gitlab.username,
            ))

        db_user = jsonable_encoder(UserModel(
            gitlabs=user_gitlabs,
        ))

        new_user_db = await self.db.insert_one(db_user)
        created_user = await self.db.find_one({"_id": new_user_db.inserted_id})

        if created_user is None:
            raise HTTPException(status_code=500, detail="Something went wrong")

        return UserResponse(
            id=str(new_user_db.inserted_id),
            gitlabs=response_gitlabs,
        )

    async def read(self, user_id: str):
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user-id")

        user_db = await self.db.find_one({"_id": ObjectId(user_id)})

        if user_db is None:
            raise HTTPException(status_code=404, detail="User not found")

        response_gitlabs = []
        for gitlab in user_db["gitlabs"]:
            gitlab_id = gitlab["id"]
            gitlab_db = await self.gitlab_crud.read(ObjectId(gitlab_id), "_id")

            response_gitlabs.append(UserGitlabResponse(
                id=gitlab_id,
                url=gitlab_db.url,
                name=gitlab_db.name,
                username=gitlab["username"],
            ))

        return UserResponse(
            id=str(user_db["_id"]),
            gitlabs=response_gitlabs,
        )

    # async def add_gitlab(self, username: str, gitlab: schemas.user.UserGitlab):
    #     user = await self.read(username)
    #
    #     if user is None:
    #         return
    #
    #     crud_gitlab = crud.gitlab.Gitlab(mongo_client=self.mongo_client)
    #
    #     db_gitlab = await crud_gitlab.read(gitlab.gitlab_url)
    #
    #     if db_gitlab is None:
    #         return
    #
    #     db_user_gitlab = jsonable_encoder(models.user.UserGitlab(
    #         gitlab_url=db_gitlab._id,
    #         username=gitlab.username,
    #         role=gitlab.role,
    #         gitlab_oauth_client_id=gitlab.gitlab_oauth_client_id,
    #     ))
