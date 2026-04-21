from __future__ import annotations

from typing import Self

from pydantic import BaseModel, Field, model_validator

from .puzzle import PuzzleDocument


class ExportRequest(BaseModel):
    puzzle: PuzzleDocument
    approved_solution: list[list[int]]
    solution_index: int = Field(default=0, ge=0)

    @model_validator(mode="after")
    def validate_solution_shape(self) -> Self:
        if len(self.approved_solution) != self.puzzle.size:
            raise ValueError("Approved solution row count does not match puzzle size.")

        for row in self.approved_solution:
            if len(row) != self.puzzle.size:
                raise ValueError("Approved solution column count does not match puzzle size.")

            for value in row:
                if value < 1 or value > self.puzzle.size:
                    raise ValueError("Approved solution contains an invalid value.")

        return self
