import type { SolveResponse, SolveResultSet } from '../../api/client';

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

function buildSummary(solveResult: SolveResponse | null): string {
  if (!solveResult) {
    return 'Cozum sonucu henuz olusturulmadi.';
  }

  const relaxedResult = solveResult.relaxed;

  if (!solveResult.has_solution && !relaxedResult?.has_solution) {
    return 'Her iki yorumda da cozum yok.';
  }

  function summarizeSet(label: string, result: SolveResultSet | null | undefined): string | null {
    if (!result) {
      return null;
    }

    if (!result.has_solution) {
      return `${label} yorumunda cozum yok.`;
    }

    if (result.is_unique) {
      return `${label} yorumunda tek cozum bulundu.`;
    }

    if (result.truncated) {
      return `${label} yorumunda en az ${result.solution_count_found} cozum bulundu ve limit doldu.`;
    }

    return `${label} yorumunda ${result.solution_count_found} farkli cozum bulundu.`;
  }

  const strictSummary = summarizeSet('Kesin', solveResult);
  const relaxedSummary = summarizeSet('Mavi daireli', relaxedResult);

  if (relaxedSummary) {
    return [strictSummary, relaxedSummary].filter(Boolean).join(' ');
  }

  return strictSummary ?? 'Cozum yok.';
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
  const showContinue = Boolean(solveResult?.has_solution || solveResult?.relaxed?.has_solution);
  const showApprove = Boolean(solveResult?.is_unique);

  return (
    <div className="solve-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Solve Karari</p>
          <h2>Cozum Sonrasi Akis</h2>
        </div>
        <div className="status-stack">
          <span className={issueCount > 0 ? 'issue-chip issue-chip-active' : 'issue-chip'}>
            {issueCount} issue
          </span>
          <span className={isValidating ? 'issue-chip issue-chip-active' : 'issue-chip'}>
            {isValidating ? 'Dogrulaniyor' : 'Hazir'}
          </span>
        </div>
      </div>

      <p className="supporting-copy">{statusMessage}</p>
      <p className="solve-summary">{buildSummary(solveResult)}</p>

      {validationError ? <p className="error-text">{validationError}</p> : null}

      <div className="actions-row">
        <button type="button" className="primary-button" onClick={onSolve} disabled={isSolving}>
          {isSolving ? 'Cozuluyor...' : 'Cozum Yap'}
        </button>

        {showContinue ? (
          <button type="button" className="secondary-button" onClick={onContinueEditing}>
            Soruyu Gelistirmeye Devam Et
          </button>
        ) : null}

        {showApprove ? (
          <button type="button" className="accent-button" onClick={onApprove}>
            Soruyu Onayla
          </button>
        ) : null}
      </div>
    </div>
  );
}
