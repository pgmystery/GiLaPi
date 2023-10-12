import pytest
from fastapi.testclient import TestClient

from gilapi_api.main import app
from tests.conftest import MongoClientHelper

post_mock_data = {
    "gitlabs": [
        {
            "name": "test",
            "url": "http://localhost:8080",
            "admin": {
                "name": "root",
                "client_id": "abc123",
            },
        },
    ],
}


client = TestClient(app)


@pytest.mark.asyncio
async def test_setup_post(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    response = client.post("/setup", json=post_mock_data)

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_setup_post_skip_setup_already_finished(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    response = client.post("/setup", json=post_mock_data)

    assert response.status_code == 200

    response2 = client.post("/setup", json=post_mock_data)

    assert response2.status_code == 404
