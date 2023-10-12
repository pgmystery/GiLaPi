from pydantic import HttpUrl, conset

from gilapi_api.db.utils.mongo_model import MongoModel


class Gitlab(MongoModel):
    name: str
    url: HttpUrl
    admins: conset(str) = set()
