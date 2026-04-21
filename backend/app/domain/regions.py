from collections.abc import Iterator

from ..schemas.puzzle import REGION_SHAPES


def get_region_shape(size: int) -> tuple[int, int]:
    return REGION_SHAPES[size]


def region_origin(row: int, col: int, region_rows: int, region_cols: int) -> tuple[int, int]:
    return (row // region_rows) * region_rows, (col // region_cols) * region_cols


def iter_region_cells(
    row: int,
    col: int,
    region_rows: int,
    region_cols: int,
) -> Iterator[tuple[int, int]]:
    origin_row, origin_col = region_origin(row, col, region_rows, region_cols)

    for region_row in range(origin_row, origin_row + region_rows):
        for region_col in range(origin_col, origin_col + region_cols):
            yield region_row, region_col
