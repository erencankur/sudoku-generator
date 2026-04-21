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

  if (!solveResult.has_solution || !selectedSolution) {
    return null;
  }

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
    </div>
  );
}
