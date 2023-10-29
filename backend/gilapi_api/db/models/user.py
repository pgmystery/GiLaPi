from typing import Optional
from bson import ObjectId
from pydantic import conlist, field_validator

from gilapi_api.db.utils.mongo_model import MongoModel


class UserGitlab(MongoModel):
    id: ObjectId
    username: str
    gitlab_oauth_client_id: Optional[str] = None
    # projects: list[Project] = []

    class Config:
        arbitrary_types_allowed=True

    @field_validator("id", mode="before")
    @classmethod
    def validate_id(cls, v):
        if not isinstance(v, ObjectId) or isinstance(v, str):
            raise ValueError(f"{'v'} must be a string or a instance of ObjectId, but it is type '{type(v)}'")

        if not ObjectId.is_valid(str(v)):
            raise ValueError("Invalid ObjectId")

        if isinstance(v, str):
            v = ObjectId(v)

        return v

    @field_validator("id", mode="after")
    @classmethod
    def serialize_id(cls, v):
        if isinstance(v, ObjectId):
            return str(v)

        return v


class User(MongoModel):
    gitlabs: conlist(UserGitlab, min_length=1)
