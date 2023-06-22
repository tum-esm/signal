import os
import random
import time
import dotenv
from tum_esm_signal import TUM_ESM_SignalClient

dotenv.load_dotenv()

cms_identity = os.getenv("TUM_ESM_SIGNAL_CMS_IDENTITY")
assert (
    cms_identity is not None
), "TUM_ESM_SIGNAL_CMS_IDENTITY environment variable not set"

cms_password = os.getenv("TUM_ESM_SIGNAL_CMS_PASSWORD")
assert (
    cms_password is not None
), "TUM_ESM_SIGNAL_CMS_PASSWORD environment variable not set"

signal_client = TUM_ESM_SignalClient(
    cms_identity=cms_identity,
    cms_password=cms_password,
    collection_name="test",
    table_name="test",
)

signal_column_co2 = signal_client.connect_column(
    column_name="CO₂",
    unit="ppm",
    minimum=350,
    maximum=4000,
    decimal_places=0,
    description="Carbon Dioxide",
)
signal_column_ch4 = signal_client.connect_column(
    column_name="CH₄",
    unit="ppm",
    minimum=1.6,
    maximum=3.0,
    decimal_places=2,
    description="Methane",
)

while True:
    print("Sending datapoints")
    signal_column_co2.add_datapoint("node_1", random.random() * 5 + 400)
    signal_column_co2.add_datapoint("node_2", random.random() * 5 + 410)
    signal_column_ch4.add_datapoint("node_1", random.random() * 0.1 + 1.7)
    signal_column_ch4.add_datapoint("node_2", random.random() * 0.1 + 1.9)
    time.sleep(2)
