from fastapi.encoders import jsonable_encoder

from gilapi_api.db import models, crud, schemas
from gilapi_api.db.models.user import UserGitlab
from gilapi_api.db.utils.crud_model import CRUDModel


# https://fastapi.tiangolo.com/tutorial/sql-databases/
# https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/


class User(CRUDModel):
    def __init__(self, mongo_client=None):
        super().__init__("users", mongo_client=mongo_client)
        self.gitlab_crud = crud.gitlab.Gitlab(mongo_client=mongo_client)

    async def create(self, user: schemas.user.User):
        user_gitlabs = []
        response_gitlabs = []

        for gitlab in user.gitlabs:
            gitlab_db = await self.gitlab_crud.db.find_one({
                "url": str(gitlab.url)
            })

            if gitlab_db is None:
                return

            user_gitlabs.append(UserGitlab(
                id=gitlab_db["_id"],
                username=gitlab.username,
                gitlab_oauth_client_id=gitlab.gitlab_oauth_client_id,
            ))
            response_gitlabs.append(schemas.user.UserGitlab(
                url=gitlab.url,
                username=gitlab.username,
            ))

        db_user = jsonable_encoder(models.User(
            gitlabs=user_gitlabs,
        ))

        new_user = await self.db.insert_one(db_user)
        created_user = await self.db.find_one({"_id": new_user.inserted_id})

        if created_user is None:
            return

        return schemas.user.User(
            gitlabs=response_gitlabs,
        )

    async def get(self, user_gitlabs: list[UserGitlab]):
        users = []

        for user_gitlab in user_gitlabs:
            user = await self.db.find_one({"gitlabs": {
                "username": user_gitlab.username,
                "url": str(user_gitlab.url),
            }})
            if user is not None:
                users.append(user)

        return users if len(users) > 0 else None

    async def add_gitlab(self, username: str, gitlab: schemas.user.UserGitlab):
        user = await self.get(username)

        if user is None:
            return

        crud_gitlab = crud.gitlab.Gitlab(mongo_client=self.mongo_client)

        db_gitlab = await crud_gitlab.get(gitlab.gitlab_url)

        if db_gitlab is None:
            return

        db_user_gitlab = jsonable_encoder(models.user.UserGitlab(
            gitlab_url=db_gitlab._id,
            username=gitlab.username,
            role=gitlab.role,
            gitlab_oauth_client_id=gitlab.gitlab_oauth_client_id,
        ))
