from pydantic import HttpUrl

from gilapi_api.db.utils.mongo_model import MongoModel


class Gitlab(MongoModel):
    url: HttpUrl
