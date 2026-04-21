from __future__ import annotations

from ..domain.consecutive import is_consecutive
from ..schemas.puzzle import PuzzleDocument
from ..schemas.validation import EdgeReference, ValidationIssue, ValidationResponse


def _duplicates(values: list[int | None]) -> dict[int, list[int]]:
    seen: dict[int, list[int]] = {}

    for index, value in enumerate(values):
        if value is None:
            continue
        seen.setdefault(value, []).append(index)

    return {value: indexes for value, indexes in seen.items() if len(indexes) > 1}


def validate_puzzle(
    puzzle: PuzzleDocument,
    allow_unmarked_consecutive: bool = False,
) -> ValidationResponse:
    issues: list[ValidationIssue] = []
    size = puzzle.size

    for row in range(size):
        for value, indexes in _duplicates(puzzle.grid[row]).items():
            issues.append(
                ValidationIssue(
                    type="row_duplicate",
                    cells=[(row, col) for col in indexes],
                    message=f"{value} appears more than once in the same row.",
                )
            )

    for col in range(size):
        column_values = [puzzle.grid[row][col] for row in range(size)]
        for value, indexes in _duplicates(column_values).items():
            issues.append(
                ValidationIssue(
                    type="column_duplicate",
                    cells=[(row, col) for row in indexes],
                    message=f"{value} appears more than once in the same column.",
                )
            )

    for start_row in range(0, size, puzzle.region_shape.rows):
        for start_col in range(0, size, puzzle.region_shape.cols):
            seen: dict[int, list[tuple[int, int]]] = {}

            for row in range(start_row, start_row + puzzle.region_shape.rows):
                for col in range(start_col, start_col + puzzle.region_shape.cols):
                    value = puzzle.grid[row][col]
                    if value is None:
                        continue
                    seen.setdefault(value, []).append((row, col))

            for value, cells in seen.items():
                if len(cells) > 1:
                    issues.append(
                        ValidationIssue(
                            type="region_duplicate",
                            cells=cells,
                            message=f"{value} appears more than once in the same region.",
                        )
                    )

    if puzzle.variant == "consecutive":
        for row in range(size):
            for col in range(size - 1):
                left = puzzle.grid[row][col]
                right = puzzle.grid[row][col + 1]
                if left is None or right is None:
                    continue

                consecutive = is_consecutive(left, right)
                marker = puzzle.consecutive_edges.horizontal[row][col]

                if marker and not consecutive:
                    issues.append(
                        ValidationIssue(
                            type="consecutive_violation",
                            cells=[(row, col), (row, col + 1)],
                            edges=[EdgeReference(orientation="horizontal", row=row, col=col)],
                            message="Marked adjacent cells must be consecutive.",
                        )
                    )
                if not marker and consecutive and not allow_unmarked_consecutive:
                    issues.append(
                        ValidationIssue(
                            type="non_consecutive_violation",
                            cells=[(row, col), (row, col + 1)],
                            edges=[EdgeReference(orientation="horizontal", row=row, col=col)],
                            message="Unmarked adjacent cells cannot be consecutive.",
                        )
                    )

        for row in range(size - 1):
            for col in range(size):
                top = puzzle.grid[row][col]
                bottom = puzzle.grid[row + 1][col]
                if top is None or bottom is None:
                    continue

                consecutive = is_consecutive(top, bottom)
                marker = puzzle.consecutive_edges.vertical[row][col]

                if marker and not consecutive:
                    issues.append(
                        ValidationIssue(
                            type="consecutive_violation",
                            cells=[(row, col), (row + 1, col)],
                            edges=[EdgeReference(orientation="vertical", row=row, col=col)],
                            message="Marked adjacent cells must be consecutive.",
                        )
                    )
                if not marker and consecutive and not allow_unmarked_consecutive:
                    issues.append(
                        ValidationIssue(
                            type="non_consecutive_violation",
                            cells=[(row, col), (row + 1, col)],
                            edges=[EdgeReference(orientation="vertical", row=row, col=col)],
                            message="Unmarked adjacent cells cannot be consecutive.",
                        )
                    )

    return ValidationResponse(is_valid=len(issues) == 0, issues=issues)
