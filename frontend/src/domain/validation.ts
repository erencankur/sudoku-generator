import type { CellCoordinate, EdgeCoordinate, PuzzleDocument } from './puzzle';

export type ValidationIssueType =
  | 'row_duplicate'
  | 'column_duplicate'
  | 'region_duplicate'
  | 'consecutive_violation'
  | 'non_consecutive_violation';

export interface ValidationIssue {
  type: ValidationIssueType;
  cells: CellCoordinate[];
  edges: EdgeCoordinate[];
  message: string;
}

export interface ValidationResponse {
  is_valid: boolean;
  issues: ValidationIssue[];
}

function issueKey(issue: ValidationIssue): string {
  return JSON.stringify(issue);
}

function findDuplicates(values: Array<number | null>): Map<number, number[]> {
  const seen = new Map<number, number[]>();

  values.forEach((value, index) => {
    if (value === null) {
      return;
    }

    const indexes = seen.get(value) ?? [];
    indexes.push(index);
    seen.set(value, indexes);
  });

  return new Map([...seen.entries()].filter(([, indexes]) => indexes.length > 1));
}

function addIssue(issues: ValidationIssue[], issue: ValidationIssue): void {
  issues.push(issue);
}

export function mergeIssues(...groups: ValidationIssue[][]): ValidationIssue[] {
  const merged = new Map<string, ValidationIssue>();

  groups.flat().forEach((issue) => {
    merged.set(issueKey(issue), issue);
  });

  return [...merged.values()];
}

export function validatePuzzleDocument(puzzle: PuzzleDocument): ValidationResponse {
  const issues: ValidationIssue[] = [];
  const { size, grid, region_shape: regionShape } = puzzle;

  for (let row = 0; row < size; row += 1) {
    const duplicates = findDuplicates(grid[row]);

    duplicates.forEach((indexes, value) => {
      addIssue(issues, {
        type: 'row_duplicate',
        cells: indexes.map((col) => [row, col]),
        edges: [],
        message: `${value} ayni satirda tekrar ediyor.`,
      });
    });
  }

  for (let col = 0; col < size; col += 1) {
    const columnValues = Array.from({ length: size }, (_, row) => grid[row][col]);
    const duplicates = findDuplicates(columnValues);

    duplicates.forEach((indexes, value) => {
      addIssue(issues, {
        type: 'column_duplicate',
        cells: indexes.map((row) => [row, col]),
        edges: [],
        message: `${value} ayni sutunda tekrar ediyor.`,
      });
    });
  }

  for (let regionRow = 0; regionRow < size; regionRow += regionShape.rows) {
    for (let regionCol = 0; regionCol < size; regionCol += regionShape.cols) {
      const seen = new Map<number, CellCoordinate[]>();

      for (let row = regionRow; row < regionRow + regionShape.rows; row += 1) {
        for (let col = regionCol; col < regionCol + regionShape.cols; col += 1) {
          const value = grid[row][col];
          if (value === null) {
            continue;
          }

          const cells = seen.get(value) ?? [];
          cells.push([row, col]);
          seen.set(value, cells);
        }
      }

      seen.forEach((cells, value) => {
        if (cells.length > 1) {
          addIssue(issues, {
            type: 'region_duplicate',
            cells,
            edges: [],
            message: `${value} ayni bolgede tekrar ediyor.`,
          });
        }
      });
    }
  }

  if (puzzle.variant === 'consecutive') {
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size - 1; col += 1) {
        const left = grid[row][col];
        const right = grid[row][col + 1];

        if (left === null || right === null) {
          continue;
        }

        const isConsecutive = Math.abs(left - right) === 1;
        const marker = puzzle.consecutive_edges.horizontal[row][col];

        if (marker && !isConsecutive) {
          addIssue(issues, {
            type: 'consecutive_violation',
            cells: [
              [row, col],
              [row, col + 1],
            ],
            edges: [{ orientation: 'horizontal', row, col }],
            message: 'Isaretli komsu hucreler ardısık olmali.',
          });
        }

        if (!marker && isConsecutive) {
          addIssue(issues, {
            type: 'non_consecutive_violation',
            cells: [
              [row, col],
              [row, col + 1],
            ],
            edges: [{ orientation: 'horizontal', row, col }],
            message: 'Isaretsiz komsu hucreler ardısık olamaz.',
          });
        }
      }
    }

    for (let row = 0; row < size - 1; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const top = grid[row][col];
        const bottom = grid[row + 1][col];

        if (top === null || bottom === null) {
          continue;
        }

        const isConsecutive = Math.abs(top - bottom) === 1;
        const marker = puzzle.consecutive_edges.vertical[row][col];

        if (marker && !isConsecutive) {
          addIssue(issues, {
            type: 'consecutive_violation',
            cells: [
              [row, col],
              [row + 1, col],
            ],
            edges: [{ orientation: 'vertical', row, col }],
            message: 'Isaretli komsu hucreler ardısık olmali.',
          });
        }

        if (!marker && isConsecutive) {
          addIssue(issues, {
            type: 'non_consecutive_violation',
            cells: [
              [row, col],
              [row + 1, col],
            ],
            edges: [{ orientation: 'vertical', row, col }],
            message: 'Isaretsiz komsu hucreler ardısık olamaz.',
          });
        }
      }
    }
  }

  return {
    is_valid: issues.length === 0,
    issues,
  };
}

export function cellHasIssue(issues: ValidationIssue[], row: number, col: number): boolean {
  return issues.some((issue) => issue.cells.some(([issueRow, issueCol]) => issueRow === row && issueCol === col));
}

export function edgeHasIssue(
  issues: ValidationIssue[],
  orientation: EdgeCoordinate['orientation'],
  row: number,
  col: number,
): boolean {
  return issues.some((issue) =>
    issue.edges.some(
      (edge) => edge.orientation === orientation && edge.row === row && edge.col === col,
    ),
  );
}
