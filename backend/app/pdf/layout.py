from dataclasses import dataclass

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm


@dataclass(frozen=True)
class PdfLayout:
    page_width: float
    page_height: float
    board_origin_x: float
    board_origin_y: float
    board_size: float
    cell_size: float
    title_y: float
    subtitle_y: float
    label_y: float
    footer_rule_y: float
    footer_text_y: float


def build_layout(size: int) -> PdfLayout:
    page_width, page_height = A4
    board_size = 122 * mm if size == 6 else 128 * mm
    board_origin_x = (page_width - board_size) / 2
    board_origin_y = 76 * mm if size == 6 else 70 * mm

    return PdfLayout(
        page_width=page_width,
        page_height=page_height,
        board_origin_x=board_origin_x,
        board_origin_y=board_origin_y,
        board_size=board_size,
        cell_size=board_size / size,
        title_y=260 * mm,
        subtitle_y=252 * mm,
        label_y=board_origin_y - 8 * mm,
        footer_rule_y=21 * mm,
        footer_text_y=15 * mm,
    )
