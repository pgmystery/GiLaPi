from typing import Optional

from bson import ObjectId
from pydantic import conlist, field_validator

from gilapi_api.db.utils.mongo_model import MongoModel


class UserGitlab(MongoModel):
    id: str
    username: str
    gitlab_oauth_client_id: Optional[str] = None
    # projects: list[Project] = []

    @field_validator("id", mode="before")
    @classmethod
    def validate_id(cls, v):
        if isinstance(v, ObjectId):
            v = str(v)

        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")

        return v


class User(MongoModel):
    gitlabs: conlist(UserGitlab, min_length=1)
