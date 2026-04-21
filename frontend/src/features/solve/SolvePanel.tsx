import type { SolveResponse, SolveResultSet } from '../../api/client';
import { useI18n } from '../../i18n';

interface SolvePanelProps {
  isSolving: boolean;
  isValidating: boolean;
  validationError: string | null;
  statusMessage: string;
  issueCount: number;
  solveResult: SolveResponse | null;
  onSolve: () => void;
  onContinueEditing: () => void;
  onApprove: () => void;
}

function buildSummary(copy: ReturnType<typeof useI18n>['copy'], solveResult: SolveResponse | null): string {
  if (!solveResult) {
    return copy.solvePanel.summary.noResult;
  }

  const relaxedResult = solveResult.relaxed;

  if (!solveResult.has_solution && !relaxedResult?.has_solution) {
    return copy.solvePanel.summary.noSolution;
  }

  function summarizeSet(label: string, result: SolveResultSet | null | undefined): string | null {
    if (!result) {
      return null;
    }

    if (!result.has_solution) {
      return `${label}: ${copy.solvePanel.summary.noSolution}`;
    }

    if (result.is_unique) {
      return `${label}: ${copy.solvePanel.summary.unique}`;
    }

    if (result.truncated) {
      return `${label}: ${copy.solvePanel.summary.truncated(result.solution_count_found)}`;
    }

    return `${label}: ${copy.solvePanel.summary.multiple(result.solution_count_found)}`;
  }

  const strictSummary = summarizeSet(copy.solvePanel.resultLabels.strict, solveResult);
  const relaxedSummary = summarizeSet(copy.solvePanel.resultLabels.relaxed, relaxedResult);

  if (relaxedSummary) {
    return [strictSummary, relaxedSummary].filter(Boolean).join(' ');
  }

  return strictSummary ?? copy.solvePanel.summary.noSolution;
}

export default function SolvePanel({
  isSolving,
  isValidating,
  validationError,
  statusMessage,
  issueCount,
  solveResult,
  onSolve,
  onContinueEditing,
  onApprove,
}: SolvePanelProps) {
  const { copy } = useI18n();
  const showContinue = Boolean(solveResult?.has_solution || solveResult?.relaxed?.has_solution);
  const showApprove = Boolean(solveResult?.is_unique);

  return (
    <div className="solve-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{copy.solvePanel.eyebrow}</p>
          <h2>{copy.solvePanel.title}</h2>
        </div>
        <div className="status-stack">
          <span className={issueCount > 0 ? 'issue-chip issue-chip-active' : 'issue-chip'}>
            {issueCount} {copy.solvePanel.issueLabel}
          </span>
          <span className={isValidating ? 'issue-chip issue-chip-active' : 'issue-chip'}>
            {isValidating ? copy.solvePanel.validatingLabel : copy.solvePanel.readyLabel}
          </span>
        </div>
      </div>

      <p className="supporting-copy">{statusMessage}</p>
      <p className="solve-summary">{buildSummary(copy, solveResult)}</p>

      {validationError ? <p className="error-text">{validationError}</p> : null}

      <div className="actions-row">
        <button type="button" className="primary-button" onClick={onSolve} disabled={isSolving}>
          {isSolving ? copy.solvePanel.solvingButton : copy.solvePanel.solveButton}
        </button>

        {showContinue ? (
          <button type="button" className="secondary-button" onClick={onContinueEditing}>
            {copy.solvePanel.continueButton}
          </button>
        ) : null}

        {showApprove ? (
          <button type="button" className="accent-button" onClick={onApprove}>
            {copy.solvePanel.approveButton}
          </button>
        ) : null}
      </div>
    </div>
  );
}
