from reportlab.pdfgen.canvas import Canvas

from .draw_edges import draw_consecutive_edges
from .draw_grid import draw_grid
from .draw_metadata import draw_metadata
from .layout import build_layout
from ..schemas.puzzle import PuzzleDocument


def draw_board_page(
    canvas: Canvas,
    puzzle: PuzzleDocument,
    values: list[list[int | None]],
    subtitle: str,
    language: str,
) -> None:
    layout = build_layout(puzzle.size)
    draw_metadata(canvas, puzzle, layout, subtitle, language)
    draw_grid(canvas, puzzle, values, layout)
    draw_consecutive_edges(canvas, puzzle, layout)


def draw_puzzle_page(canvas: Canvas, puzzle: PuzzleDocument, language: str) -> None:
    draw_board_page(canvas, puzzle, puzzle.grid, "", language)


def draw_solution_page(canvas: Canvas, puzzle: PuzzleDocument, approved_solution: list[list[int]], language: str) -> None:
    draw_board_page(canvas, puzzle, approved_solution, "", language)
