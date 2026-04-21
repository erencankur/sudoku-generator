from pydantic import BaseModel, Field

from .puzzle import PuzzleDocument
from .validation import ValidationResponse


class SolveRequest(BaseModel):
    puzzle: PuzzleDocument
    solution_limit: int = Field(default=12, ge=1, le=128)


class SolveResultSet(BaseModel):
    has_solution: bool
    solution_count_found: int
    truncated: bool
    is_unique: bool
    solutions: list[list[list[int]]] = Field(default_factory=list)
    validation: ValidationResponse


class SolveResponse(SolveResultSet):
    relaxed: SolveResultSet | None = None
