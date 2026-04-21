from __future__ import annotations

import numpy as np

from ..domain.board import to_numpy_grid, to_python_grid
from ..schemas.puzzle import PuzzleDocument
from .constraints import candidate_values
from .enumerator import EnumerationResult


def _find_best_empty_cell(
    board: np.ndarray,
    puzzle: PuzzleDocument,
) -> tuple[int, int, list[int]] | None:
    best: tuple[int, int, list[int]] | None = None

    for row in range(puzzle.size):
        for col in range(puzzle.size):
            if int(board[row, col]) != 0:
                continue

            candidates = candidate_values(board, puzzle, row, col)
            if not candidates:
                return row, col, []

            if best is None or len(candidates) < len(best[2]):
                best = (row, col, candidates)

            if best is not None and len(best[2]) == 1:
                return best

    return best


def enumerate_solutions(puzzle: PuzzleDocument, solution_limit: int) -> EnumerationResult:
    board = to_numpy_grid(puzzle)
    collected: list[list[list[int]]] = []
    truncated = False
    hard_limit = solution_limit + 1

    def search() -> None:
        nonlocal truncated

        if len(collected) >= hard_limit:
            truncated = True
            return

        choice = _find_best_empty_cell(board, puzzle)
        if choice is None:
            collected.append(to_python_grid(board))
            if len(collected) >= hard_limit:
                truncated = True
            return

        row, col, candidates = choice
        if not candidates:
            return

        for candidate in candidates:
            board[row, col] = candidate
            search()
            board[row, col] = 0

            if truncated:
                return

    search()
    return EnumerationResult(
        solutions=collected[:solution_limit],
        found_count=len(collected),
        truncated=truncated,
    )
