
# TUM ESM Signal

Replaces the `shareable-timeseries-visualization` repository.

**Installation:**

```bash
poetry add tum-esm-signal
# or
pip install tum-esm-signal
```

**Usage:**

```python
from tum_esm_signal import TUM_ESM_SignalClient

signal_client = TUM_ESM_SignalClient(
    cms_identity=cms_identity, cms_password=cms_password,
    collection_name="test", table_name="test",
    sensor_id="test",
)

data_column_co2 = signal_client.connect_column(
    column_name="co2", unit="ppm",
    minimum=350, maximum=4000, decimal_places=0,
)
data_column_ch4 = signal_client.connect_column(
    column_name="ch4", unit="ppm",
    minimum=1.6, maximum=3.0, decimal_places=2,
    description="Methane",
)

while True:
    print("Sending datapoints")
    data_column_co2.add_datapoint(random.randint(350, 4000))
    data_column_ch4.add_datapoint(random.random() * 1.4 + 1.6)
    time.sleep(2)
```