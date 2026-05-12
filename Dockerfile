FROM node:22-bookworm-slim AS frontend-build
WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm ci

COPY frontend ./frontend
RUN npm run build

FROM python:3.13-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=9999 \
    FRONTEND_DIST_DIR=/app/frontend/dist

WORKDIR /app

COPY backend/pyproject.toml ./backend/pyproject.toml
COPY backend/app ./backend/app
RUN pip install --no-cache-dir ./backend

COPY --from=frontend-build /app/frontend/dist ./frontend/dist

EXPOSE 9999
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import os, urllib.request; urllib.request.urlopen(f'http://127.0.0.1:{os.getenv(\"PORT\", \"9999\")}/api/health', timeout=3).read()"

CMD ["sh", "-c", "uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port ${PORT:-9999} --proxy-headers"]
