import pytest
from fastapi.testclient import TestClient

from gilapi_api.main import app
from tests.conftest import MongoClientHelper
from tests.routes.setup.mock_data import post_mock_data


client = TestClient(app)


@pytest.mark.asyncio
async def test_get_no_setup_finish(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    response = client.get("/setup")

    assert response.status_code == 200
    assert response.text == "false"


@pytest.mark.asyncio
async def test_get_with_setup_finish(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    response = client.post("/setup", json=post_mock_data)

    assert response.status_code == 201

    response = client.get("/setup")

    assert response.status_code == 200
    assert response.text == "true"
