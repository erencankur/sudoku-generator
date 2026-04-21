import numpy as np

from ..domain.consecutive import adjacency_rules, is_consecutive
from ..domain.regions import iter_region_cells
from ..schemas.puzzle import PuzzleDocument


def row_values(board: np.ndarray, row: int) -> set[int]:
    return {int(value) for value in board[row] if int(value) != 0}


def column_values(board: np.ndarray, col: int) -> set[int]:
    return {int(value) for value in board[:, col] if int(value) != 0}


def region_values(board: np.ndarray, puzzle: PuzzleDocument, row: int, col: int) -> set[int]:
    values: set[int] = set()
    region_rows = puzzle.region_shape.rows
    region_cols = puzzle.region_shape.cols

    for region_row, region_col in iter_region_cells(row, col, region_rows, region_cols):
        value = int(board[region_row, region_col])
        if value != 0:
            values.add(value)

    return values


def satisfies_adjacent_constraints(
    board: np.ndarray,
    puzzle: PuzzleDocument,
    row: int,
    col: int,
    candidate: int,
) -> bool:
    if puzzle.variant != "consecutive":
        return True

    for neighbor_row, neighbor_col, has_marker in adjacency_rules(puzzle, row, col):
        neighbor_value = int(board[neighbor_row, neighbor_col])
        if neighbor_value == 0:
            continue

        candidate_is_consecutive = is_consecutive(neighbor_value, candidate)

        if has_marker and not candidate_is_consecutive:
            return False
        if not has_marker and candidate_is_consecutive:
            return False

    return True


def candidate_values(board: np.ndarray, puzzle: PuzzleDocument, row: int, col: int) -> list[int]:
    if int(board[row, col]) != 0:
        return []

    disallowed = row_values(board, row) | column_values(board, col) | region_values(board, puzzle, row, col)

    candidates: list[int] = []
    for candidate in range(1, puzzle.size + 1):
        if candidate in disallowed:
            continue
        if satisfies_adjacent_constraints(board, puzzle, row, col, candidate):
            candidates.append(candidate)

    return candidates
