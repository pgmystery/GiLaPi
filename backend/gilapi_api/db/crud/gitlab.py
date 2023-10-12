from typing import Any

from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from pymongo.errors import DuplicateKeyError

from gilapi_api.db import schemas, models
from gilapi_api.db.utils.crud_model import CRUDModel


class Gitlab(CRUDModel):
    def __init__(self, mongo_client=None):
        super().__init__("gitlabs", mongo_client=mongo_client)

    async def get(self, value: Any, key: str = "name"):
        gitlab = await self.db.find_one({key: value})

        return gitlab

    async def get_all(self):
        db_cursor = self.db.find({})
        gitlabs = await db_cursor.to_list(length=None)

        return gitlabs

    async def create(self, gitlab: schemas.gitlab.Gitlab):
        db_gitlab = jsonable_encoder(models.Gitlab(
            name=gitlab.name,
            url=gitlab.url,
            admins=gitlab.admins,
        ))

        await self.db.create_index("name", unique=True)
        await self.db.create_index("url", unique=True)

        try:
            new_gitlab = await self.db.insert_one(db_gitlab)
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail=f"Gitlab with the name ({gitlab.name}) or url ({str(gitlab.url)}) already registered")

        created_gitlab = await self.db.find_one({"_id": new_gitlab.inserted_id})

        return created_gitlab

    async def delete(self, name: str):
        gitlab = await self.db.find_one_and_delete({"name": name})

        return gitlab
