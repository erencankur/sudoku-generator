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
    canvas.setLineWidth(0.9)

    for row in range(puzzle.size):
        for col in range(puzzle.size - 1):
            state = puzzle.consecutive_edges.horizontal[row][col]
            if state == 0:
                continue

            center_x = layout.board_origin_x + (col + 1) * layout.cell_size
            center_y = top - (row + 0.5) * layout.cell_size

            if state == 1:
                canvas.setFillColor(colors.HexColor("#6e91b4"))
                canvas.setStrokeColor(colors.HexColor("#456f95"))
                canvas.circle(center_x, center_y, radius, stroke=1, fill=1)
            else:
                canvas.setFillColor(colors.white)
                canvas.setStrokeColor(colors.HexColor("#8f6f6a"))
                canvas.circle(center_x, center_y, radius, stroke=1, fill=0)
                slash = radius * 0.65
                canvas.setStrokeColor(colors.HexColor("#8f6f6a"))
                canvas.setLineWidth(1.1)
                canvas.line(center_x - slash, center_y - slash, center_x + slash, center_y + slash)
                canvas.line(center_x - slash, center_y + slash, center_x + slash, center_y - slash)
                canvas.setLineWidth(0.9)

    for row in range(puzzle.size - 1):
        for col in range(puzzle.size):
            state = puzzle.consecutive_edges.vertical[row][col]
            if state == 0:
                continue

            center_x = layout.board_origin_x + (col + 0.5) * layout.cell_size
            center_y = top - (row + 1) * layout.cell_size

            if state == 1:
                canvas.setFillColor(colors.HexColor("#6e91b4"))
                canvas.setStrokeColor(colors.HexColor("#456f95"))
                canvas.circle(center_x, center_y, radius, stroke=1, fill=1)
            else:
                canvas.setFillColor(colors.white)
                canvas.setStrokeColor(colors.HexColor("#8f6f6a"))
                canvas.circle(center_x, center_y, radius, stroke=1, fill=0)
                slash = radius * 0.65
                canvas.setStrokeColor(colors.HexColor("#8f6f6a"))
                canvas.setLineWidth(1.1)
                canvas.line(center_x - slash, center_y - slash, center_x + slash, center_y + slash)
                canvas.line(center_x - slash, center_y + slash, center_x + slash, center_y - slash)
                canvas.setLineWidth(0.9)
