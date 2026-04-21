import numpy as np

from ..schemas.puzzle import PuzzleDocument


def to_numpy_grid(puzzle: PuzzleDocument) -> np.ndarray:
    return np.array([[cell or 0 for cell in row] for row in puzzle.grid], dtype=np.int16)


def to_python_grid(board: np.ndarray) -> list[list[int]]:
    return [[int(value) for value in row] for row in board.tolist()]
