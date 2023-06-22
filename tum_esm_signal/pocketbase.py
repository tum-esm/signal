from typing import Optional
import requests

CMS_URL = "https://esm-linode.dostuffthatmatters.dev"


class PocketBaseInterface:
    auth_token: str = None

    @staticmethod
    def authenticate(cms_identity: str, cms_password: str) -> str:
        if PocketBaseInterface.auth_token is None:
            r = requests.post(
                CMS_URL + "/api/collections/users/auth-with-password",
                data={"identity": cms_identity, "password": cms_password},
            )
            response = r.json()
            try:
                assert type(response) == dict and "token" in response
                PocketBaseInterface.auth_token = response["token"]
                assert isinstance(PocketBaseInterface.auth_token, str)
            except AssertionError:
                raise AssertionError(f"Failed to login: {r.text}")

        return PocketBaseInterface.auth_token

    def __init__(self, cms_identity: str, cms_password: str) -> None:
        auth_token = self.authenticate(cms_identity, cms_password)
        self.headers = {"Authorization": f"Bearer {auth_token}"}

    def get_existing_column_id(
        self,
        collection_name: str,
        table_name: str,
        column_name: str,
    ) -> Optional[str]:
        filter_query = (
            "filter=("
            + f"(collection_name='{collection_name}')%26%26"
            + f"(table_name='{table_name}')%26%26"
            + f"(column_name='{column_name}')"
            + ")"
        )
        r = requests.get(
            CMS_URL + "/api/collections/signal_columns/records?" + filter_query,
            headers=self.headers,
        )
        assert str(r.status_code).startswith("2"), f"Failed to get column id: {r.text}"

        column_ids: list[str] = [item["id"] for item in r.json()["items"]]
        if len(column_ids) == 0:
            return None
        elif len(column_ids) == 1:
            return column_ids[0]
        else:
            raise Exception("Multiple column ids found")

    def create_column(
        self,
        collection_name: str,
        table_name: str,
        column_name: str,
        unit: str,
        description: str = None,
        minimum: float = None,
        decimal_places: int = None,
    ) -> str:
        r = requests.post(
            CMS_URL + "/api/collections/signal_columns/records",
            json={
                "collection_name": collection_name,
                "table_name": table_name,
                "column_name": column_name,
                "unit": unit,
                "description": description,
                "minimum": minimum,
                "decimal_places": decimal_places,
            },
            headers=self.headers,
        )
        assert str(r.status_code).startswith("2"), f"Failed to create column: {r.text}"

    def update_column(
        self,
        column_id: str,
        collection_name: str,
        table_name: str,
        column_name: str,
        unit: str,
        description: str = None,
        minimum: float = None,
        decimal_places: int = None,
    ) -> None:
        r = requests.patch(
            CMS_URL + f"/api/collections/signal_columns/records/{column_id}",
            json={
                "collection_name": collection_name,
                "table_name": table_name,
                "column_name": column_name,
                "unit": unit,
                "description": description,
                "minimum": minimum,
                "decimal_places": decimal_places,
            },
            headers=self.headers,
        )
        assert str(r.status_code).startswith("2"), f"Failed to update column: {r.text}"
