from reportlab.lib import colors
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.lib.units import mm
from reportlab.pdfgen.canvas import Canvas

from .layout import PdfLayout
from ..schemas.puzzle import PuzzleDocument


def _localized_pdf_copy(language: str) -> dict[str, str]:
    if language == "en":
        return {
            "classic_prefix": "Classic Sudoku by",
            "consecutive_prefix": "Consecutive Pairs Sudoku by",
            "board_label_classic": "Classic",
            "board_label_consecutive": "Checkered",
            "footer_text": "Sudoku Generator",
        }

    return {
        "classic_prefix": "Klasik Sudoku by",
        "consecutive_prefix": "Ardisik Ciftler Sudoku by",
        "board_label_classic": "Classic",
        "board_label_consecutive": "Checkered",
        "footer_text": "Sudoku Uretici",
    }


def draw_metadata(canvas: Canvas, puzzle: PuzzleDocument, layout: PdfLayout, subtitle: str, language: str) -> None:
    canvas.setFillColor(colors.HexColor("#1f1a17"))
    localized = _localized_pdf_copy(language)
    title_prefix = localized["consecutive_prefix"] if puzzle.variant == "consecutive" else localized["classic_prefix"]
    prefix_font = "Helvetica"
    prefix_size = 20
    name_font = "Helvetica-Bold"
    name_size = 27 if len(puzzle.name) <= 16 else 24

    prefix_width = stringWidth(title_prefix + " ", prefix_font, prefix_size)
    name_width = stringWidth(puzzle.name, name_font, name_size)
    total_width = prefix_width + name_width
    start_x = (layout.page_width - total_width) / 2

    canvas.setFont(prefix_font, prefix_size)
    canvas.drawString(start_x, layout.title_y, title_prefix + " ")

    canvas.setFont(name_font, name_size)
    canvas.drawString(start_x + prefix_width, layout.title_y - 2, puzzle.name)

    canvas.setFillColor(colors.HexColor("#6b6056"))
    if subtitle:
        canvas.setFont("Helvetica", 9)
        canvas.drawCentredString(layout.page_width / 2, layout.subtitle_y, subtitle)

    canvas.setLineWidth(0.7)
    canvas.setStrokeColor(colors.HexColor("#6b6056"))
    canvas.line(18 * mm, layout.footer_rule_y, layout.page_width - 18 * mm, layout.footer_rule_y)

    canvas.setFont("Helvetica-Oblique", 13)
    canvas.drawString(
        layout.board_origin_x,
        layout.label_y,
        localized["board_label_classic"] if puzzle.variant == "classic" else localized["board_label_consecutive"],
    )
    canvas.drawRightString(layout.board_origin_x + layout.board_size, layout.label_y, f"{{1-{puzzle.size}}}")

    canvas.setFont("Helvetica", 9.5)
    canvas.drawString(18 * mm, layout.footer_text_y, localized["footer_text"])
    canvas.drawRightString(layout.page_width - 18 * mm, layout.footer_text_y, puzzle.created_at)
