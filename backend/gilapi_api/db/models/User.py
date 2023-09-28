from enum import IntEnum
from pydantic import BaseModel

from gilapi_api.db.models.Project import Project


class UserRole(IntEnum):
    admin = 0
    user = 1


class User(BaseModel):
    name: str
    role: UserRole
    projects: list[Project]
