from abc import ABC
from typing import Any

from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from pymongo.errors import DuplicateKeyError

from gilapi_api.db.models.gitlab import GitlabModel, Gitlab as GitlabValidationModel
from gilapi_api.db.schemas.gitlab import Gitlab as GitlabSchema
from gilapi_api.db.utils.crud_model import CRUDModel


class Gitlab(CRUDModel, ABC):
    def __init__(self, mongo_client=None):
        super().__init__("gitlabs", mongo_client=mongo_client)

    async def read(self, value: Any, key: str = "name") -> GitlabModel | None:
        gitlab = await self.db.find_one({key: value})

        if gitlab is None:
            return

        return GitlabModel.from_dict(gitlab)

    async def read_all(self) -> list[GitlabModel]:
        db_cursor = self.db.find({})
        gitlabs = await db_cursor.to_list(length=None)

        return [GitlabModel.from_dict(gitlab) for gitlab in gitlabs]

    async def create(self, gitlab: GitlabSchema):
        db_gitlab = jsonable_encoder(GitlabValidationModel(
            name=gitlab.name,
            url=gitlab.url,
            redirect_url=gitlab.redirect_url,
            admins=gitlab.admins,
        ))

        await self.db.create_index("name", unique=True)
        await self.db.create_index("url", unique=True)

        try:
            new_gitlab = await self.db.insert_one(db_gitlab)
        except DuplicateKeyError:
            raise HTTPException(
                status_code=400,
                detail=f"Gitlab with the name ({gitlab.name}) or url ({str(gitlab.url)}) already registered",
            )

        created_gitlab = await self.db.find_one({"_id": new_gitlab.inserted_id})

        return created_gitlab

    async def delete(self, name: str):
        gitlab = await self.db.find_one_and_delete({"name": name})

        return gitlab
