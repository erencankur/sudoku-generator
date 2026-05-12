from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .api.routes.export import router as export_router
from .api.routes.health import router as health_router
from .api.routes.solve import router as solve_router
from .api.routes.validate import router as validate_router
from .config import APP_NAME, APP_VERSION, CORS_ALLOW_ORIGINS, FRONTEND_DIST_DIR


app = FastAPI(title=f"{APP_NAME} API", version=APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(validate_router)
app.include_router(solve_router)
app.include_router(export_router)

if FRONTEND_DIST_DIR.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST_DIR, html=True), name="frontend")
