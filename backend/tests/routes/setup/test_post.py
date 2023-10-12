import pytest
from fastapi.testclient import TestClient

from gilapi_api.main import app
from tests.conftest import MongoClientHelper

client = TestClient(app)


@pytest.mark.asyncio
async def test_setup_post(mongo_client: MongoClientHelper):
    await mongo_client.drop_database()

    data = {
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

    response = client.post("/setup", json=data)

    assert response.status_code == 200
