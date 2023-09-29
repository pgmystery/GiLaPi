# https://fastapi.tiangolo.com/tutorial/sql-databases/
# https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/
from fastapi.encoders import jsonable_encoder
from motor.core import AgnosticClient

from gilapi_api.db import models
from gilapi_api.db.schemas import User


async def create(db: AgnosticClient, user: User):
    db_user = jsonable_encoder(models.User(
        name=user.name,
        role=user.role,
    ))

    new_user = await db["users"].insert_one(db_user)
    created_user = await db["users"].find_one({"_id": new_user.inserted_id})

    return created_user


async def get(db: AgnosticClient, username: str):
    user = await db["users"].find_one({"name": username})

    return user
