import asyncio
from time import sleep

import pytest
from docker import APIClient
from docker.errors import NotFound, DockerException
from docker.models.containers import Container

import docker

from gilapi_api.db import get_mongo_client
from gilapi_api.db.db import MongoClient
from gilapi_api.settings import get_settings


@pytest.fixture(scope="session")
def event_loop():
    return asyncio.get_event_loop()


class MongoClientHelper:
    def __init__(self, mongo_client: MongoClient):
        self.mongo_client = mongo_client
        self.client = mongo_client.client
        self.db = mongo_client.db

    async def drop_database(self):
        await self.client.drop_database(self.db)


@pytest.fixture
def mongo_client():
    return MongoClientHelper(get_mongo_client())


def create_database_container():
    def get_health(docker_container: Container):
        api_client = APIClient()
        inspect_results = api_client.inspect_container(docker_container.name)

        return inspect_results["State"]["Health"]["Status"]

    settings = get_settings()
    mongo_client_config = settings.db.get_mongo_client_config()

    docker_client = docker.from_env()

    container = docker_client.containers.run(
        image="mongo:latest",
        detach=True,
        auto_remove=True,
        ports={
            "27017/tcp": mongo_client_config.port,
        },
        environment={
            "MONGO_INITDB_ROOT_USERNAME": mongo_client_config.username,
            "MONGO_INITDB_DATABASE": mongo_client_config.db,
            "MONGO_INITDB_ROOT_PASSWORD": mongo_client_config.password,
        },
        healthcheck={
            "test": ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"],
            "interval": int(5e9),
            "timeout": int(5e9),
            "retries": 3,
        },
    )

    while get_health(container) == "starting":
        sleep(0.1)

    sleep(1)  # TODO: THE HEALTHY FUNCTION IS NOT RLY WORKING...

    if get_health(container) != "healthy":
        try:
            container.stop()
        except NotFound:
            raise DockerException(f"Container is unhealthy: {container.id}")

        raise DockerException(f"Container was unhealthy: {container.id}")

    return container


def pytest_sessionstart(session):
    session.docker_database_container = create_database_container()


def pytest_sessionfinish(session):
    if hasattr(session, "docker_database_container"):
        try:
            session.docker_database_container.stop()
        except NotFound:
            pass


def pytest_exception_interact(node):
    session = node.session

    if hasattr(session, "docker_database_container"):
        try:
            session.docker_database_container.stop()
        except NotFound:
            pass
