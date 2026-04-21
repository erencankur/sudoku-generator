import { cellHasIssue, edgeHasIssue, type ValidationIssue } from '../../domain/validation';
import type { PuzzleDocument } from '../../domain/puzzle';
import EdgeToggleLayer from './EdgeToggleLayer';
import SudokuCell from './SudokuCell';

interface SudokuGridProps {
  puzzle: PuzzleDocument;
  issues: ValidationIssue[];
  onCellChange: (row: number, col: number, rawValue: string) => void;
  onToggleEdge: (orientation: 'horizontal' | 'vertical', row: number, col: number) => void;
}

export default function SudokuGrid({
  puzzle,
  issues,
  onCellChange,
  onToggleEdge,
}: SudokuGridProps) {
  const { size, region_shape: regionShape } = puzzle;

  return (
    <div className="grid-shell">
      {puzzle.variant === 'consecutive' ? (
        <div className="edge-legend" aria-label="Ardısik isaret aciklamasi">
          <span className="edge-legend-item">
            <span className="edge-legend-swatch edge-legend-required" aria-hidden="true" />
            Mavi daire koy
          </span>
          <span className="edge-legend-item">
            <span className="edge-legend-swatch edge-legend-forbidden" aria-hidden="true" />
            Kesinlikle koyma
          </span>
          <span className="edge-legend-item">
            <span className="edge-legend-swatch edge-legend-empty" aria-hidden="true" />
            Bos bırak
          </span>
        </div>
      ) : null}

      <div className="sudoku-grid" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
        {puzzle.grid.map((rowValues, row) =>
          rowValues.map((value, col) => {
            const borderClasses = [
              'cell-wrapper',
              col % regionShape.cols === 0 ? 'region-left' : '',
              row % regionShape.rows === 0 ? 'region-top' : '',
              col === size - 1 ? 'region-right' : '',
              row === size - 1 ? 'region-bottom' : '',
              col === size - 1 || (col + 1) % regionShape.cols === 0 ? 'region-edge-right' : '',
              row === size - 1 || (row + 1) % regionShape.rows === 0 ? 'region-edge-bottom' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div key={`${row}-${col}`} className={borderClasses}>
                <SudokuCell
                  value={value}
                  size={size}
                  invalid={cellHasIssue(issues, row, col)}
                  onChange={(rawValue) => onCellChange(row, col, rawValue)}
                />

                {puzzle.variant === 'consecutive' && col < size - 1 ? (
                  <EdgeToggleLayer
                    orientation="horizontal"
                    state={puzzle.consecutive_edges.horizontal[row][col]}
                    invalid={edgeHasIssue(issues, 'horizontal', row, col)}
                    onToggle={() => onToggleEdge('horizontal', row, col)}
                  />
                ) : null}

                {puzzle.variant === 'consecutive' && row < size - 1 ? (
                  <EdgeToggleLayer
                    orientation="vertical"
                    state={puzzle.consecutive_edges.vertical[row][col]}
                    invalid={edgeHasIssue(issues, 'vertical', row, col)}
                    onToggle={() => onToggleEdge('vertical', row, col)}
                  />
                ) : null}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
