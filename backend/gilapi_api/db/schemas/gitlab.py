from pydantic import HttpUrl, BaseModel, Field, conset


class Gitlab(BaseModel):
    name: str
    url: HttpUrl
    admins: conset(str, min_length=1)


class GitlabResponse(Gitlab):
    admins: conset(str, min_length=1) = Field(exclude=True)

    # id: str = Field(validation_alias="_id")
    #
    # @field_validator("id", mode="before")
    # @classmethod
    # def validate_id(cls, v):
    #     if isinstance(v, ObjectId):
    #         v = str(v)
    #
    #     if not ObjectId.is_valid(v):
    #         raise ValueError("Invalid objectid")
    #
    #     return v