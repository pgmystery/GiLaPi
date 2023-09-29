from pydantic import BaseModel


class MongoModel(BaseModel):
    def __str__(self):
        return self.__class__.__name__.lower()

    def __dict__(self):
        return self.model_dump()
