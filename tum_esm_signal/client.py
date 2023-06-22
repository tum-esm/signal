import requests


CMS_URL = "https://esm-linode.dostuffthatmatters.dev"


class TUM_ESM_SignalClient:
    def __init__(
        self,
        cms_identity: str,
        cms_password: str,
        collection_name: str,
        table_name: str,
        sensor_id: str,
        column_name: str,
        unit: str,
        description: str,
        minimum: float,
        decimal_places: int,
    ) -> None:
        self.auth_token = TUM_ESM_SignalClientAuth.get_auth_token(
            cms_identity, cms_password
        )

        self.collection_name = collection_name
        self.table_name = table_name
        self.sensor_id = sensor_id
        self.column_name = column_name
        self.unit = unit
        self.description = description
        self.minimum = minimum
        self.decimal_places = decimal_places

        # check if column exists
        pass

        # if yes, update column
        pass

        # if no, create column
        pass

    def write_date(self, value: float) -> None:
        # determine utc timestamp
        pass

        # write value to pocketbase
        pass


class TUM_ESM_SignalClientAuth:
    auth_token: str = None

    @staticmethod
    def get_auth_token(cms_identity: str, cms_password: str) -> str:
        if TUM_ESM_SignalClientAuth.auth_token is None:
            r = requests.post(
                CMS_URL + "/api/collections/users/auth-with-password",
                data={"identity": cms_identity, "password": cms_password},
            )
            response = r.json()
            try:
                assert type(response) == dict and "token" in response
                TUM_ESM_SignalClientAuth.auth_token = response["token"]
                assert isinstance(TUM_ESM_SignalClientAuth.auth_token, str)
            except AssertionError:
                raise AssertionError(f"Failed to login: {r.text}")

        return TUM_ESM_SignalClientAuth.auth_token
