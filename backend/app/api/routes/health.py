from fastapi import APIRouter

from ...config import APP_ENV, APP_VERSION


router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "environment": APP_ENV, "version": APP_VERSION}
