from collections.abc import Iterator

from ..schemas.puzzle import PuzzleDocument


def is_consecutive(value_a: int, value_b: int) -> bool:
    return abs(value_a - value_b) == 1


def adjacency_rules(
    puzzle: PuzzleDocument,
    row: int,
    col: int,
) -> Iterator[tuple[int, int, bool]]:
    if col > 0:
        yield row, col - 1, puzzle.consecutive_edges.horizontal[row][col - 1]
    if col < puzzle.size - 1:
        yield row, col + 1, puzzle.consecutive_edges.horizontal[row][col]
    if row > 0:
        yield row - 1, col, puzzle.consecutive_edges.vertical[row - 1][col]
    if row < puzzle.size - 1:
        yield row + 1, col, puzzle.consecutive_edges.vertical[row][col]
