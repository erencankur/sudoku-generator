from typing import Literal

from pydantic import BaseModel, Field


ValidationIssueType = Literal[
    "row_duplicate",
    "column_duplicate",
    "region_duplicate",
    "consecutive_violation",
    "non_consecutive_violation",
]


class EdgeReference(BaseModel):
    orientation: Literal["horizontal", "vertical"]
    row: int = Field(ge=0)
    col: int = Field(ge=0)


class ValidationIssue(BaseModel):
    type: ValidationIssueType
    cells: list[tuple[int, int]] = Field(default_factory=list)
    edges: list[EdgeReference] = Field(default_factory=list)
    message: str


class ValidationResponse(BaseModel):
    is_valid: bool
    issues: list[ValidationIssue] = Field(default_factory=list)
