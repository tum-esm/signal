
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
```