from fastapi import APIRouter, HTTPException, Response

from ...schemas.export import ExportRequest
from ...services.export_service import build_export_pdf


router = APIRouter(prefix="/api", tags=["export"])


def _safe_name(name: str) -> str:
    lowered = name.strip().lower()
    sanitized = "".join(character if character.isalnum() else "-" for character in lowered)
    return sanitized.strip("-") or "sudoku"


@router.post("/export")
def export_route(request: ExportRequest) -> Response:
    try:
        pdf_bytes = build_export_pdf(request)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    filename = f"{_safe_name(request.puzzle.name)}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
