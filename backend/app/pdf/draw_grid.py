from reportlab.lib import colors
from reportlab.pdfgen.canvas import Canvas

from .layout import PdfLayout
from ..schemas.puzzle import PuzzleDocument


def draw_grid(
    canvas: Canvas,
    puzzle: PuzzleDocument,
    values: list[list[int | None]],
    layout: PdfLayout,
) -> None:
    top = layout.board_origin_y + layout.board_size

    canvas.setFillColor(colors.white)
    canvas.rect(layout.board_origin_x, layout.board_origin_y, layout.board_size, layout.board_size, fill=1, stroke=0)

    for index in range(puzzle.size + 1):
        horizontal_width = 2.4 if index in (0, puzzle.size) else 0.8
        if index not in (0, puzzle.size) and index % puzzle.region_shape.rows == 0:
            horizontal_width = 1.9

        canvas.setLineWidth(horizontal_width)
        canvas.setStrokeColor(colors.HexColor("#312a25"))

        horizontal_y = top - index * layout.cell_size
        canvas.line(layout.board_origin_x, horizontal_y, layout.board_origin_x + layout.board_size, horizontal_y)

    for index in range(puzzle.size + 1):
        vertical_width = 2.4 if index in (0, puzzle.size) else 0.8
        if index not in (0, puzzle.size) and index % puzzle.region_shape.cols == 0:
            vertical_width = 1.9

        canvas.setLineWidth(vertical_width)
        canvas.setStrokeColor(colors.HexColor("#312a25"))

        vertical_x = layout.board_origin_x + index * layout.cell_size
        canvas.line(vertical_x, layout.board_origin_y, vertical_x, layout.board_origin_y + layout.board_size)

    canvas.setFillColor(colors.HexColor("#1f1a17"))
    canvas.setFont("Helvetica", 18 if puzzle.size == 6 else 16)

    for row_index, row in enumerate(values):
        for col_index, value in enumerate(row):
            if value is None:
                continue

            center_x = layout.board_origin_x + (col_index + 0.5) * layout.cell_size
            center_y = top - (row_index + 0.62) * layout.cell_size
            canvas.drawCentredString(center_x, center_y, str(value))
