from pydantic import BaseModel


class Project(BaseModel):
    namespace: str
