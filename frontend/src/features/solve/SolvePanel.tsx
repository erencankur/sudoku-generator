import type { SolveResponse } from '../../api/client';

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

  if (!solveResult.has_solution) {
    return 'Cozum yok.';
  }

  if (solveResult.is_unique) {
    return 'Tek cozum bulundu.';
  }

  if (solveResult.truncated) {
    return `En az ${solveResult.solution_count_found} cozum bulundu ve limit doldu.`;
  }

  return `${solveResult.solution_count_found} farkli cozum bulundu.`;
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
  const showContinue = Boolean(solveResult?.has_solution);
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
