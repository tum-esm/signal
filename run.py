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
    column_name="test",
    sensor_id="test",
    unit="test",
    description="test",
    minimum=0,
    maximum=10,
    decimal_places=0,
)

while True:
    print("Sending datapoint")
    signal_client.add_datapoint(random.randint(0, 10))
    time.sleep(2)
