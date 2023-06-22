import os
import shutil

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MYPY_CACHE_DIR = os.path.join(PROJECT_DIR, ".mypy_cache")


def test_static_types():
    if os.path.exists(MYPY_CACHE_DIR):
        shutil.rmtree(MYPY_CACHE_DIR)
    exit_code = os.system("mypy tum_esm_signal")
    assert exit_code == 0


def test_black_formatting() -> None:
    exit_code = os.system("black --check tum_esm_signal")
    assert exit_code == 0
