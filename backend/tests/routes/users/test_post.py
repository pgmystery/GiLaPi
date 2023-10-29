import pytest
from bson import ObjectId

from tests.routes.users.mock.utils import TestUser


class TestUserPost(TestUser):
    @pytest.mark.asyncio
    async def test_users_post(self):
        response = self.client.post("/users", json={
            "gitlabs": [
                {
                    "username": self.USERNAME,
                    "url": self.mock_gitlab["url"],
                    "gitlab_oauth_client_id": "test",
                }
            ]
        })

        assert response.status_code == 201

        response_result = response.json()

        assert ObjectId.is_valid(response_result["id"])

        assert response_result == {
            "id": response_result["id"],
            "gitlabs": [
                {
                    "id": next(gitlab["id"] for gitlab in response_result["gitlabs"] if gitlab["url"] == self.mock_gitlab["url"]),
                    "name": self.mock_gitlab["name"],
                    "url": self.mock_gitlab["url"],
                    "username": self.USERNAME,
                },
            ],
        }
