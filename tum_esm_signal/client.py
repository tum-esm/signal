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
        column_name: str,
        sensor_id: str,
        unit: str,
        description: str,
        minimum: float,
        maximum: float,
        decimal_places: int,
    ) -> None:
        self.pockebase = tum_esm_signal.PocketBaseInterface(cms_identity, cms_password)

        self.collection_name = collection_name
        self.table_name = table_name
        self.sensor_id = sensor_id
        self.column_name = column_name

        # connect column id
        self.column_id = self.pockebase.upsert_column(
            collection_name,
            table_name,
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

        self.pockebase.create_data_record(
            self.column_id,
            self.sensor_id,
            value,
            datetime_str,
        )
