from pydantic import HttpUrl, BaseModel, Field, conset


class Gitlab(BaseModel):
    name: str
    url: HttpUrl
    redirect_url: HttpUrl
    admins: conset(str) = set()


class GitlabResponse(Gitlab):
    admins: conset(str) = Field(exclude=True)
