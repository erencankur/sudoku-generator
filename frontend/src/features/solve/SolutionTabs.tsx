import { useMemo } from 'react';
import type { SolveResultSet } from '../../api/client';
import type { PuzzleDocument } from '../../domain/puzzle';

interface SolutionTabsProps {
  puzzle: PuzzleDocument;
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
  result: SolveResultSet;
  selectedSolutionIndex: number;
  onSelectSolution: (index: number) => void;
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
}: SolutionTabsProps) {
  const selectedSolution = result.solutions[selectedSolutionIndex];
  const showMarkers = puzzle.variant === 'consecutive';
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

                  {showMarkers && colIndex < puzzle.size - 1 && puzzle.consecutive_edges.horizontal[rowIndex][colIndex] ? (
                    <span className="solution-edge solution-edge-horizontal" aria-hidden="true" />
                  ) : null}

                  {showMarkers && rowIndex < puzzle.size - 1 && puzzle.consecutive_edges.vertical[rowIndex][colIndex] ? (
                    <span className="solution-edge solution-edge-vertical" aria-hidden="true" />
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
