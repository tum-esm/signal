from typing import Optional
import requests

CMS_URL = "https://esm-linode.dostuffthatmatters.dev"


class PocketBaseInterface:
    auth_token: Optional[str] = None

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

    def upsert_column(
        self,
        collection_name: str,
        table_name: str,
        column_name: str,
        unit: str,
        description: str,
        minimum: float,
        maximum: float,
        decimal_places: int,
    ) -> str:
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

        column_id: Optional[str] = None
        column_ids: list[str] = [item["id"] for item in r.json()["items"]]
        assert len(column_ids) <= 1, "Multiple column ids found"
        if len(column_ids) == 1:
            column_id = column_ids[0]
            assert isinstance(column_id, str)

        body = {
            "collection_name": collection_name,
            "table_name": table_name,
            "column_name": column_name,
            "unit": unit,
            "description": description,
            "minimum": minimum,
            "maximum": maximum,
            "decimal_places": decimal_places,
        }
        if column_id is None:
            r = requests.post(
                CMS_URL + "/api/collections/signal_columns/records",
                json=body,
                headers=self.headers,
            )
            assert str(r.status_code).startswith(
                "2"
            ), f"Failed to create column: {r.text}"
            new_column_id = r.json()["id"]
            assert isinstance(new_column_id, str)
            return new_column_id
        else:
            r = requests.patch(
                CMS_URL + f"/api/collections/signal_columns/records/{column_id}",
                json=body,
                headers=self.headers,
            )
            assert str(r.status_code).startswith(
                "2"
            ), f"Failed to update column: {r.text}"
            return column_id

    def create_data_record(
        self,
        column_id: str,
        sensor_id: str,
        value: float,
        datetime_str: str,
    ) -> None:
        r = requests.post(
            CMS_URL + "/api/collections/signal_records/records",
            json={
                "signal_column": column_id,
                "sensor_id": sensor_id,
                "datetime": datetime_str,
                "value": value,
            },
            headers=self.headers,
        )
        assert str(r.status_code).startswith(
            "2"
        ), f"Failed to create data record: {r.text}"
