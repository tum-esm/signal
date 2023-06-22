import tum_esm_signal

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
            unit=unit,
            description=description,
            minimum=minimum,
            decimal_places=decimal_places,
        )

    def write_date(self, value: float) -> None:
        # determine utc timestamp
        pass

        # write value to pocketbase
        pass
