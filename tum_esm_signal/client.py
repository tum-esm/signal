from __future__ import annotations
import tum_esm_signal
import pendulum

CMS_URL = "https://esm-linode.dostuffthatmatters.dev"


class TUM_ESM_SignalClient:
    def __init__(
        self,
        cms_identity: str,
        cms_password: str,
        collection_name: str,
        table_name: str,
        sensor_id: str,
    ) -> None:
        self.pocketbase = tum_esm_signal.PocketBaseInterface(cms_identity, cms_password)
        self.collection_name = collection_name
        self.table_name = table_name
        self.sensor_id = sensor_id

    def connect_column(
        self,
        column_name: str,
        unit: str,
        minimum: float,
        maximum: float,
        decimal_places: int,
        description: str = "",
    ) -> TUM_ESM_SignalClient_SensorColumn:
        return TUM_ESM_SignalClient_SensorColumn(
            self,
            column_name,
            unit,
            description,
            minimum,
            maximum,
            decimal_places,
        )


class TUM_ESM_SignalClient_SensorColumn:
    def __init__(
        self,
        signal_client: TUM_ESM_SignalClient,
        column_name: str,
        unit: str,
        description: str,
        minimum: float,
        maximum: float,
        decimal_places: int,
    ) -> None:
        self.signal_client = signal_client
        self.column_name = column_name

        # connect column id
        self.column_id = self.signal_client.pocketbase.upsert_column(
            self.signal_client.collection_name,
            self.signal_client.table_name,
            column_name,
            unit,
            description,
            minimum,
            maximum,
            decimal_places,
        )

    def add_datapoint(self, value: float) -> None:
        """Add a datapoint to the selected column. The record time
        is set to the current time."""

        # looks like "2021-01-01T00:00:00.000Z"
        datetime_str = pendulum.now("UTC").to_iso8601_string()  # type: ignore
        assert isinstance(datetime_str, str)

        self.signal_client.pocketbase.create_data_record(
            self.column_id,
            self.signal_client.sensor_id,
            value,
            datetime_str,
        )
