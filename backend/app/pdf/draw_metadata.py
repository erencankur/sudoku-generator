from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfgen.canvas import Canvas

from .layout import PdfLayout
from ..schemas.puzzle import PuzzleDocument


def draw_metadata(canvas: Canvas, puzzle: PuzzleDocument, layout: PdfLayout, subtitle: str) -> None:
    canvas.setFillColor(colors.HexColor("#1f1a17"))
    canvas.setFont("Helvetica-Bold", 22)
    canvas.drawCentredString(layout.page_width / 2, layout.title_y, puzzle.name)

    canvas.setFillColor(colors.HexColor("#6b6056"))
    canvas.setFont("Helvetica", 11)
    canvas.drawCentredString(layout.page_width / 2, layout.subtitle_y, subtitle)

    canvas.setLineWidth(0.7)
    canvas.setStrokeColor(colors.HexColor("#6b6056"))
    canvas.line(18 * mm, layout.footer_rule_y, layout.page_width - 18 * mm, layout.footer_rule_y)

    canvas.setFont("Helvetica", 10)
    canvas.drawString(layout.board_origin_x, layout.label_y, "Classic" if puzzle.variant == "classic" else "Consecutive")
    canvas.drawRightString(layout.board_origin_x + layout.board_size, layout.label_y, f"{{1-{puzzle.size}}}")

    canvas.setFont("Helvetica", 9.5)
    canvas.drawString(18 * mm, layout.footer_text_y, "Sudoku Generator")
    canvas.drawRightString(layout.page_width - 18 * mm, layout.footer_text_y, puzzle.created_at)
