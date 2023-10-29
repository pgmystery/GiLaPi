import pytest

from tests.routes.users.mock.utils import TestUser


class TestUserGet(TestUser):
    @pytest.mark.asyncio
    async def test_get(self):
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

        response_data = response.json()
        response = self.client.get(f"/users/{response_data['id']}")

        assert response.status_code == 200

        response_result = response.json()

        assert response_result == {
            "id": response_result["id"],
            "gitlabs": [
                {
                    "id": next(gitlab["id"] for gitlab in response_result["gitlabs"] if gitlab["url"] == self.mock_gitlab["url"]),
                    "url": self.mock_gitlab["url"],
                    "name": self.mock_gitlab["name"],
                    "username": self.USERNAME,
                }
            ]
        }
