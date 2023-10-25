import pytest

from tests.routes.users.mock.utils import TestUser


class TestUserGet(TestUser):
    @pytest.mark.asyncio
    async def test_get(self):
        gitlab_name = self.mock_gitlab["name"]
        username = self.USERNAME

        response = self.client.post("/users", json={
            "gitlabs": [
                {
                    "username": username,
                    "url": self.mock_gitlab["url"],
                    "gitlab_oauth_client_id": "test",
                }
            ]
        })

        assert response.status_code == 201

        response = self.client.get(f"/users/{gitlab_name}/{username}")
        print(response)
        response_result = response.json()
        print(response_result)
