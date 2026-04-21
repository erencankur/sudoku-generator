from __future__ import annotations

from typing import Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator


PuzzleVariant = Literal["classic", "consecutive"]
PuzzleSize = Literal[6, 9]

REGION_SHAPES: dict[int, tuple[int, int]] = {
    6: (2, 3),
    9: (3, 3),
}


def _empty_edges(size: int) -> dict[str, list[list[bool]]]:
    return {
        "horizontal": [[False for _ in range(size - 1)] for _ in range(size)],
        "vertical": [[False for _ in range(size)] for _ in range(size - 1)],
    }


class RegionShape(BaseModel):
    rows: int = Field(gt=0)
    cols: int = Field(gt=0)


class ConsecutiveEdges(BaseModel):
    horizontal: list[list[bool]]
    vertical: list[list[bool]]


class PuzzleDocument(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=120)
    created_at: str = Field(min_length=8, max_length=16)
    variant: PuzzleVariant
    size: PuzzleSize
    region_shape: RegionShape | None = None
    grid: list[list[int | None]]
    consecutive_edges: ConsecutiveEdges | None = None

    @model_validator(mode="after")
    def validate_document(self) -> Self:
        expected_rows, expected_cols = REGION_SHAPES[self.size]

        if self.region_shape is None:
            self.region_shape = RegionShape(rows=expected_rows, cols=expected_cols)
        elif (self.region_shape.rows, self.region_shape.cols) != (expected_rows, expected_cols):
            raise ValueError("Region shape does not match the selected size.")

        if len(self.grid) != self.size:
            raise ValueError("Grid row count does not match the selected size.")

        for row in self.grid:
            if len(row) != self.size:
                raise ValueError("Grid column count does not match the selected size.")

            for value in row:
                if value is None:
                    continue
                if value < 1 or value > self.size:
                    raise ValueError("Grid contains a value outside the valid range.")

        if self.consecutive_edges is None:
            self.consecutive_edges = ConsecutiveEdges(**_empty_edges(self.size))

        horizontal = self.consecutive_edges.horizontal
        vertical = self.consecutive_edges.vertical

        if len(horizontal) != self.size or any(len(row) != self.size - 1 for row in horizontal):
            raise ValueError("Horizontal edge matrix has invalid dimensions.")

        if len(vertical) != self.size - 1 or any(len(row) != self.size for row in vertical):
            raise ValueError("Vertical edge matrix has invalid dimensions.")

        return self
