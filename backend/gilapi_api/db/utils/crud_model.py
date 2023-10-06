from abc import abstractmethod
from motor.core import AgnosticDatabase

from gilapi_api.db import get_mongo_client


class CRUDModel:
    def __init__(self, collection_name: str, mongo_client: AgnosticDatabase = None):
        if mongo_client is None:
            _mongo_client = get_mongo_client()
            self.mongo_client = _mongo_client.db
        else:
            self.mongo_client = mongo_client
        self.collection_name = collection_name
        self.db = self.mongo_client[self.collection_name]

    @abstractmethod
    async def get(self, *args, **kwargs): ...

    @abstractmethod
    async def get_all(self, *args, **kwargs): ...

    @abstractmethod
    async def create(self, *args, **kwargs): ...

    @abstractmethod
    async def delete(self, *args, **kwargs): ...

    @abstractmethod
    async def update(self, *args, **kwargs): ...
