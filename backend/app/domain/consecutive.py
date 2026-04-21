from collections.abc import Iterator

from ..schemas.puzzle import PuzzleDocument


def is_consecutive(value_a: int, value_b: int) -> bool:
    return abs(value_a - value_b) == 1


def adjacency_rules(
    puzzle: PuzzleDocument,
    row: int,
    col: int,
) -> Iterator[tuple[int, int, int]]:
    if col > 0:
        yield row, col - 1, puzzle.consecutive_edges.horizontal[row][col - 1]
    if col < puzzle.size - 1:
        yield row, col + 1, puzzle.consecutive_edges.horizontal[row][col]
    if row > 0:
        yield row - 1, col, puzzle.consecutive_edges.vertical[row - 1][col]
    if row < puzzle.size - 1:
        yield row + 1, col, puzzle.consecutive_edges.vertical[row][col]


def count_added_consecutive_markers(
    puzzle: PuzzleDocument,
    solution: list[list[int]],
) -> int:
    added = 0

    for row in range(puzzle.size):
        for col in range(puzzle.size - 1):
            if puzzle.consecutive_edges.horizontal[row][col] != 0:
                continue

            if is_consecutive(solution[row][col], solution[row][col + 1]):
                added += 1

    for row in range(puzzle.size - 1):
        for col in range(puzzle.size):
            if puzzle.consecutive_edges.vertical[row][col] != 0:
                continue

            if is_consecutive(solution[row][col], solution[row + 1][col]):
                added += 1

    return added
