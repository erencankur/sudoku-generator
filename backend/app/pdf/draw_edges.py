from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfgen.canvas import Canvas

from .layout import PdfLayout
from ..schemas.puzzle import PuzzleDocument


def draw_consecutive_edges(canvas: Canvas, puzzle: PuzzleDocument, layout: PdfLayout) -> None:
    if puzzle.variant != "consecutive":
        return

    top = layout.board_origin_y + layout.board_size
    radius = 3.0 * mm if puzzle.size == 6 else 2.6 * mm
    canvas.setFillColor(colors.HexColor("#d5d0c7"))
    canvas.setStrokeColor(colors.HexColor("#7f776d"))
    canvas.setLineWidth(0.9)

    for row in range(puzzle.size):
        for col in range(puzzle.size - 1):
            if puzzle.consecutive_edges.horizontal[row][col]:
                center_x = layout.board_origin_x + (col + 1) * layout.cell_size
                center_y = top - (row + 0.5) * layout.cell_size
                canvas.circle(center_x, center_y, radius, stroke=1, fill=1)

    for row in range(puzzle.size - 1):
        for col in range(puzzle.size):
            if puzzle.consecutive_edges.vertical[row][col]:
                center_x = layout.board_origin_x + (col + 0.5) * layout.cell_size
                center_y = top - (row + 1) * layout.cell_size
                canvas.circle(center_x, center_y, radius, stroke=1, fill=1)
