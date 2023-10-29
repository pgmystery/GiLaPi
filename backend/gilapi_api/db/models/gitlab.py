from dataclasses import dataclass, field
from typing import Optional

from bson import ObjectId
from dataclasses_json import dataclass_json, config
from pydantic.dataclasses import dataclass as pydantic_dataclass
from pydantic import HttpUrl, conset


@dataclass
class GitlabBaseModel:
    name: str
    url: HttpUrl
    redirect_url: HttpUrl
    admins: conset(str) = field(default_factory=set)


@dataclass_json
@dataclass
class GitlabModel(GitlabBaseModel):
    id: Optional[ObjectId] = field(default=None, metadata=config(field_name="_id"))


@pydantic_dataclass
class Gitlab(GitlabBaseModel):
    ...
