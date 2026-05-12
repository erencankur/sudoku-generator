import os
from pathlib import Path

from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / ".env", override=False)


def _csv_env(name: str, default: str = "") -> list[str]:
    raw_value = os.getenv(name, default)
    return [item.strip().rstrip("/") for item in raw_value.split(",") if item.strip()]


def _path_env(name: str, default: Path) -> Path:
    value = Path(os.getenv(name, str(default)))
    return value if value.is_absolute() else PROJECT_ROOT / value


APP_ENV = os.getenv("APP_ENV", "development")
APP_NAME = os.getenv("APP_NAME", "Sudoku Generator")
APP_VERSION = os.getenv("APP_VERSION", "0.1.0")
PORT = int(os.getenv("PORT", "8000"))
FRONTEND_DIST_DIR = _path_env("FRONTEND_DIST_DIR", PROJECT_ROOT / "frontend" / "dist")

CORS_ALLOW_ORIGINS = _csv_env(
    "CORS_ALLOW_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)
