from abc import ABC
from dataclasses import dataclass

from fastapi import HTTPException

from gilapi_api.db.utils.crud_model import CRUDModel
from gilapi_api.db.schemas.setup import Setup as SetupSchema
from gilapi_api.db.crud.gitlab import Gitlab as GitlabCRUD
from gilapi_api.db.schemas.gitlab import Gitlab as GitlabSchema
from gilapi_api.db.crud.user import User as UserCRUD
from gilapi_api.db.schemas.user import User as UserSchema, UserGitlab as UserGitlabSchema


@dataclass
class SetupCRUD:
    gitlab: GitlabCRUD
    user: UserCRUD


class Setup(CRUDModel, ABC):
    def __init__(self, mongo_client=None):
        super().__init__("setup", mongo_client=mongo_client)
        self.crud = SetupCRUD(
            gitlab=GitlabCRUD(mongo_client=mongo_client),
            user=UserCRUD(mongo_client=mongo_client),
        )

    async def create(self, setup_data: SetupSchema):
        user_gitlabs: list[UserGitlabSchema] = []

        # Check if at least one gitlab with an admin
        if all(gitlab.admin is None for gitlab in setup_data.gitlabs):
            raise HTTPException(
                status_code=400,
                detail="Need at least one gitlab with an user to set a gilapi-admin",
            )

        for gitlab in setup_data.gitlabs:
            admins = set() if gitlab.admin is None else {gitlab.admin.name}

            gitlab_db = await self.crud.gitlab.create(gitlab=GitlabSchema(
                name=gitlab.name,
                url=gitlab.url,
                admins=admins
            ))

            if gitlab_db is None:
                raise HTTPException(
                    status_code=400,
                    detail="Unknown error",
                )

            if gitlab.admin is not None:
                user_gitlabs.append(UserGitlabSchema(
                    url=gitlab.url,
                    username=gitlab.admin.name,
                    gitlab_oauth_client_id=gitlab.admin.client_id,
                ))

        user_db = await self.crud.user.create(UserSchema(
            gitlabs=user_gitlabs
        ))

        if user_db is None:
            raise HTTPException(
                status_code=400,
                detail="Couldn't create the user",
            )
