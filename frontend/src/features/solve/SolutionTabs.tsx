import { useMemo } from 'react';
import type { SolveResponse } from '../../api/client';
import type { PuzzleDocument } from '../../domain/puzzle';

interface SolutionTabsProps {
  puzzle: PuzzleDocument;
  solveResult: SolveResponse;
  selectedSolutionIndex: number;
  onSelectSolution: (index: number) => void;
}

export default function SolutionTabs({
  puzzle,
  solveResult,
  selectedSolutionIndex,
  onSelectSolution,
}: SolutionTabsProps) {
  const selectedSolution = solveResult.solutions[selectedSolutionIndex];
  const commonGrid = useMemo(() => {
    if (solveResult.solutions.length === 0) {
      return [] as Array<Array<number | null>>;
    }

    const firstSolution = solveResult.solutions[0];

    return firstSolution.map((row, rowIndex) =>
      row.map((value, colIndex) => {
        const isSharedAcrossAllSolutions = solveResult.solutions.every(
          (solution) => solution[rowIndex][colIndex] === value,
        );

        return isSharedAcrossAllSolutions ? value : null;
      }),
    );
  }, [solveResult.solutions]);

  const commonCellCount = commonGrid.flat().filter((value) => value !== null).length;
  const totalCellCount = puzzle.size * puzzle.size;

  if (!solveResult.has_solution || !selectedSolution) {
    return null;
  }

  const commonCaption =
    solveResult.is_unique || solveResult.solutions.length === 1
      ? 'Tek cozum bulundugu icin tum hucreler ortaktir.'
      : solveResult.truncated
        ? 'Bu bolum, bulunan cozumler arasinda ortak kalan hucreleri gosterir. Limit nedeniyle sadece bulunan cozumler uzerinden hesaplanir.'
        : 'Bu bolum, bulunan tum cozumler arasinda degismeyen hucreleri gosterir.';

  return (
    <div className="solutions-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Tum Cozumler</p>
          <h2>Bulunan Cozumleri Incele</h2>
        </div>
      </div>

      <div className="solution-tabs">
        {solveResult.solutions.map((_, index) => (
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
    </div>
  );
}
