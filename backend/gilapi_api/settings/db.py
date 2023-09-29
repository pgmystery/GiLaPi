from pathlib import Path
from typing import Final
from pydantic import BaseModel, FilePath
from pydantic_settings import BaseSettings, SettingsConfigDict


class MongoClientConfig(BaseModel):
    host: str
    port: int
    username: str
    password: str
    db: str


class DBSettings(BaseSettings):
    host: str = "localhost"
    port: int = 27017
    username: str = "root"
    password: str = "root"
    db: Final = "gilapi"

    model_config = SettingsConfigDict(env_prefix="GILAPI_DB_", env_file=".env")

    def get_mongo_client_config(self) -> MongoClientConfig:
        password = self.password
        password_file_path = Path(password)

        if password_file_path.is_file():
            with open(password_file_path, "r") as f:
                password = f.read()

        return MongoClientConfig(
            host=self.host,
            port=self.port,
            username=self.username,
            password=password,
            db=self.db,
        )
