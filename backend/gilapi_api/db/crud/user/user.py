from fastapi.encoders import jsonable_encoder

from gilapi_api.db import models, crud, schemas
from gilapi_api.db.crud.user.gitlabs import UserGitlabs
from gilapi_api.db.models.user import UserGitlab
from gilapi_api.db.utils.crud_model import CRUDModel


# https://fastapi.tiangolo.com/tutorial/sql-databases/
# https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/


class User(CRUDModel):
    def __init__(self, mongo_client=None):
        super().__init__("users", mongo_client=mongo_client)
        self.user_gitlabs = UserGitlabs(mongo_client=mongo_client)

    async def create(self, user: schemas.user.User):
        gitlabs = []
        for gitlab in user.gitlabs:
            gitlabs.append(UserGitlab(
                url=gitlab.url,
                username=gitlab.username,
                gitlab_oauth_client_id=gitlab.gitlab_oauth_client_id,
            ))

        db_user = jsonable_encoder(models.User(
            gitlabs=gitlabs,
        ))

        new_user = await self.db.insert_one(db_user)
        created_user = await self.db.find_one({"_id": new_user.inserted_id})

        return created_user

    async def get(self, gitlabs: list):
        user = await self.db.find_one({"gitlabs": {
            "url": gitlab_url,
            "username": username,
        }})

        return user

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
