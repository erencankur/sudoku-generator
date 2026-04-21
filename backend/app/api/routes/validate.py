from fastapi import APIRouter

from ...schemas.puzzle import PuzzleDocument
from ...schemas.validation import ValidationResponse
from ...services.validation_service import validate_puzzle


router = APIRouter(prefix="/api", tags=["validation"])


@router.post("/validate", response_model=ValidationResponse)
def validate_route(puzzle: PuzzleDocument) -> ValidationResponse:
    return validate_puzzle(puzzle)
