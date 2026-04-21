import { useMemo } from 'react';
import type { SolveResultSet } from '../../api/client';
import type { ConsecutiveEdgeState, PuzzleDocument } from '../../domain/puzzle';

interface SolutionTabsProps {
  puzzle: PuzzleDocument;
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
  result: SolveResultSet;
  selectedSolutionIndex: number;
  onSelectSolution: (index: number) => void;
  showInferredMarkers?: boolean;
}

export default function SolutionTabs({
  puzzle,
  eyebrow,
  title,
  description,
  emptyMessage,
  result,
  selectedSolutionIndex,
  onSelectSolution,
  showInferredMarkers = false,
}: SolutionTabsProps) {
  const selectedSolution = result.solutions[selectedSolutionIndex];
  const showMarkers = puzzle.variant === 'consecutive';
  const renderedMarkers = useMemo(() => {
    if (!showMarkers || !selectedSolution) {
      return {
        horizontal: [] as ConsecutiveEdgeState[][],
        vertical: [] as ConsecutiveEdgeState[][],
      };
    }

    const horizontal = Array.from({ length: puzzle.size }, () =>
      Array.from({ length: puzzle.size - 1 }, () => 0 as ConsecutiveEdgeState),
    );
    const vertical = Array.from({ length: puzzle.size - 1 }, () =>
      Array.from({ length: puzzle.size }, () => 0 as ConsecutiveEdgeState),
    );

    for (let row = 0; row < puzzle.size; row += 1) {
      for (let col = 0; col < puzzle.size - 1; col += 1) {
        const originalMarker = puzzle.consecutive_edges.horizontal[row][col];
        const inferredMarker =
          showInferredMarkers && originalMarker === 0 && Math.abs(selectedSolution[row][col] - selectedSolution[row][col + 1]) === 1;

        horizontal[row][col] = originalMarker !== 0 ? originalMarker : inferredMarker ? 1 : 0;
      }
    }

    for (let row = 0; row < puzzle.size - 1; row += 1) {
      for (let col = 0; col < puzzle.size; col += 1) {
        const originalMarker = puzzle.consecutive_edges.vertical[row][col];
        const inferredMarker =
          showInferredMarkers && originalMarker === 0 && Math.abs(selectedSolution[row][col] - selectedSolution[row + 1][col]) === 1;

        vertical[row][col] = originalMarker !== 0 ? originalMarker : inferredMarker ? 1 : 0;
      }
    }

    return { horizontal, vertical };
  }, [puzzle, selectedSolution, showMarkers, showInferredMarkers]);

  const commonGrid = useMemo(() => {
    if (result.solutions.length === 0) {
      return [] as Array<Array<number | null>>;
    }

    const firstSolution = result.solutions[0];

    return firstSolution.map((row, rowIndex) =>
      row.map((value, colIndex) => {
        const isSharedAcrossAllSolutions = result.solutions.every(
          (solution) => solution[rowIndex][colIndex] === value,
        );

        return isSharedAcrossAllSolutions ? value : null;
      }),
    );
  }, [result.solutions]);

  const commonCellCount = commonGrid.flat().filter((value) => value !== null).length;
  const totalCellCount = puzzle.size * puzzle.size;

  const hasSolutions = result.solutions.length > 0 && Boolean(selectedSolution);
  const commonCaption =
    result.is_unique || result.solutions.length === 1
      ? 'Tek cozum bulundugu icin tum hucreler ortaktir.'
      : result.truncated
        ? 'Bu bolum, bulunan cozumler arasinda ortak kalan hucreleri gosterir. Limit nedeniyle sadece bulunan cozumler uzerinden hesaplanir.'
        : 'Bu bolum, bulunan tum cozumler arasinda degismeyen hucreleri gosterir.';

  return (
    <div className="solutions-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
      </div>

      <p className="supporting-copy">{description}</p>

      {hasSolutions ? (
        <>
          <div className="solution-tabs">
            {result.solutions.map((_, index) => (
              <button
                key={`solution-tab-${index}`}
                type="button"
                className={index === selectedSolutionIndex ? 'solution-tab active' : 'solution-tab'}
                onClick={() => onSelectSolution(index)}
              >
                Cozum {index + 1}
              </button>
            ))}
          </div>

          <div className="solution-preview" style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}>
            {selectedSolution.flatMap((row, rowIndex) =>
              row.map((value, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className="solution-cell">
                  {value}

                  {showMarkers && colIndex < puzzle.size - 1 && renderedMarkers.horizontal[rowIndex][colIndex] !== 0 ? (
                    <span
                      className={
                        renderedMarkers.horizontal[rowIndex][colIndex] === 1
                          ? 'solution-edge solution-edge-horizontal solution-edge-required'
                          : 'solution-edge solution-edge-horizontal solution-edge-forbidden'
                      }
                      aria-hidden="true"
                    />
                  ) : null}

                  {showMarkers && rowIndex < puzzle.size - 1 && renderedMarkers.vertical[rowIndex][colIndex] !== 0 ? (
                    <span
                      className={
                        renderedMarkers.vertical[rowIndex][colIndex] === 1
                          ? 'solution-edge solution-edge-vertical solution-edge-required'
                          : 'solution-edge solution-edge-vertical solution-edge-forbidden'
                      }
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              )),
            )}
          </div>

          <div className="common-parts-panel">
            <div className="common-parts-header">
              <div>
                <p className="eyebrow">Ortak Kisimlar</p>
                <h3>Cozumler arasinda sabit kalan hucreler</h3>
              </div>
              <span className="common-parts-badge">
                {commonCellCount}/{totalCellCount}
              </span>
            </div>

            <p className="supporting-copy">{commonCaption}</p>

            <div className="common-grid" style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}>
              {commonGrid.flatMap((row, rowIndex) =>
                row.map((value, colIndex) => (
                  <div
                    key={`common-${rowIndex}-${colIndex}`}
                    className={value === null ? 'common-cell common-cell-empty' : 'common-cell'}
                  >
                    {value ?? '—'}
                  </div>
                )),
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="solution-empty-state">{emptyMessage}</div>
      )}
    </div>
  );
}
