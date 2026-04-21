from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen.canvas import Canvas

from ..pdf.draw_solution import draw_puzzle_page, draw_solution_page
from ..schemas.export import ExportRequest
from .validation_service import validate_puzzle


def build_export_pdf(request: ExportRequest) -> bytes:
    solved_puzzle = request.puzzle.model_copy(deep=True)
    solved_puzzle.grid = [[int(value) for value in row] for row in request.approved_solution]

    validation = validate_puzzle(solved_puzzle)
    if not validation.is_valid:
        raise ValueError("Approved solution does not satisfy the puzzle rules.")

    buffer = BytesIO()
    canvas = Canvas(buffer, pagesize=A4)

    draw_puzzle_page(canvas, request.puzzle)
    canvas.showPage()
    draw_solution_page(canvas, request.puzzle, request.approved_solution)
    canvas.save()

    buffer.seek(0)
    return buffer.getvalue()
