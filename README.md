# TUM ESM Signal

🔥 Replaces https://github.com/tum-esm/shareable-timeseries-visualization

<br/>

**Installation:**

```bash
poetry add tum-esm-signal
# or
pip install tum-esm-signal
```

<br/>

**Usage:**

```python
from tum_esm_signal import TUM_ESM_SignalClient

signal_client = TUM_ESM_SignalClient(
    cms_identity="username", cms_password="password",
    collection_name="test", table_name="test",
)

signal_column_co2 = signal_client.connect_column(
    column_name="CO₂", unit="ppm",
    minimum=350, maximum=4000, decimal_places=0,
    description="Carbon Dioxide",
)
signal_column_ch4 = signal_client.connect_column(
    column_name="CH₄", unit="ppm",
    minimum=1.6, maximum=3.0, decimal_places=2,
    description="Methane",
)

while True:
    print("Sending datapoints")
    signal_column_co2.add_datapoint("node_1", random.random() * 5 + 400)
    signal_column_co2.add_datapoint("node_2", random.random() * 5 + 410)
    signal_column_ch4.add_datapoint("node_1", random.random() * 0.1 + 1.7)
    signal_column_ch4.add_datapoint("node_2", random.random() * 0.1 + 1.9)
    time.sleep(15)

```
