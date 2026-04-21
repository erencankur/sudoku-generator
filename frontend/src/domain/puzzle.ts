export type PuzzleVariant = 'classic' | 'consecutive';
export type PuzzleSize = 6 | 9;
export type GridValue = number | null;
export type Grid = GridValue[][];
export type CellCoordinate = [number, number];

export interface RegionShape {
  rows: number;
  cols: number;
}

export interface ConsecutiveEdges {
  horizontal: boolean[][];
  vertical: boolean[][];
}

export interface EdgeCoordinate {
  orientation: 'horizontal' | 'vertical';
  row: number;
  col: number;
}

export interface PuzzleDocument {
  name: string;
  created_at: string;
  variant: PuzzleVariant;
  size: PuzzleSize;
  region_shape: RegionShape;
  grid: Grid;
  consecutive_edges: ConsecutiveEdges;
}

const REGION_SHAPES: Record<PuzzleSize, RegionShape> = {
  6: { rows: 2, cols: 3 },
  9: { rows: 3, cols: 3 },
};

const DEFAULT_NAMES: Record<PuzzleVariant, string> = {
  classic: 'Klasik Sudoku',
  consecutive: 'Ardisik Sudoku',
};

function createBooleanMatrix(rows: number, cols: number): boolean[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));
}

function createGrid(size: PuzzleSize): Grid {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getRegionShape(size: PuzzleSize): RegionShape {
  return REGION_SHAPES[size];
}

export function getAllowedValues(size: PuzzleSize): number[] {
  return Array.from({ length: size }, (_, index) => index + 1);
}

export function getRangeLabel(puzzle: PuzzleDocument): string {
  return `{1-${puzzle.size}}`;
}

export function createEmptyPuzzle(
  variant: PuzzleVariant = 'classic',
  size: PuzzleSize = 9,
  name?: string,
): PuzzleDocument {
  return {
    name: name ?? DEFAULT_NAMES[variant],
    created_at: todayIsoDate(),
    variant,
    size,
    region_shape: getRegionShape(size),
    grid: createGrid(size),
    consecutive_edges: {
      horizontal: createBooleanMatrix(size, size - 1),
      vertical: createBooleanMatrix(size - 1, size),
    },
  };
}

export function clonePuzzle(puzzle: PuzzleDocument): PuzzleDocument {
  return {
    ...puzzle,
    region_shape: { ...puzzle.region_shape },
    grid: puzzle.grid.map((row) => [...row]),
    consecutive_edges: {
      horizontal: puzzle.consecutive_edges.horizontal.map((row) => [...row]),
      vertical: puzzle.consecutive_edges.vertical.map((row) => [...row]),
    },
  };
}

export function withVariantAndSize(
  puzzle: PuzzleDocument,
  variant: PuzzleVariant,
  size: PuzzleSize,
): PuzzleDocument {
  return createEmptyPuzzle(variant, size, puzzle.name);
}

export function coerceCellValue(rawValue: string, size: PuzzleSize): GridValue {
  const trimmed = rawValue.trim();

  if (trimmed.length === 0) {
    return null;
  }

  const parsed = Number.parseInt(trimmed, 10);

  if (Number.isNaN(parsed) || parsed < 1 || parsed > size) {
    return null;
  }

  return parsed;
}

export function updateCellValue(
  puzzle: PuzzleDocument,
  row: number,
  col: number,
  rawValue: string,
): PuzzleDocument {
  const nextPuzzle = clonePuzzle(puzzle);
  nextPuzzle.grid[row][col] = coerceCellValue(rawValue, puzzle.size);
  return nextPuzzle;
}

export function toggleEdge(
  puzzle: PuzzleDocument,
  orientation: EdgeCoordinate['orientation'],
  row: number,
  col: number,
): PuzzleDocument {
  const nextPuzzle = clonePuzzle(puzzle);
  const targetMatrix =
    orientation === 'horizontal'
      ? nextPuzzle.consecutive_edges.horizontal
      : nextPuzzle.consecutive_edges.vertical;

  targetMatrix[row][col] = !targetMatrix[row][col];
  return nextPuzzle;
}

export function boardSignature(puzzle: PuzzleDocument): string {
  return JSON.stringify({
    variant: puzzle.variant,
    size: puzzle.size,
    grid: puzzle.grid,
    consecutive_edges: puzzle.consecutive_edges,
  });
}

