from dataclasses import dataclass
from typing import Optional
from pydantic import BaseModel, conset, Field

from gilapi_api.db.schemas.gitlab import Gitlab


class SetupAdmin(BaseModel):
    name: str
    client_id: str

    class Config:
        frozen = True


class SetupGitlab(Gitlab):
    admins: None = Field(None, exclude=True)  # TODO: Is not excluding the field
    admin: Optional[SetupAdmin] = None

    class Config:
        frozen = True


class Setup(BaseModel):
    gitlabs: conset(SetupGitlab, min_length=1)
