import os


def test_static_types():
    exit_code = os.system("mypy tum_esm_signal")
    assert exit_code == 0


def test_black_formatting() -> None:
    exit_code = os.system("black --check tum_esm_signal")
    assert exit_code == 0
