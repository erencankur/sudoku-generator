import { useEffect, useMemo, useState } from 'react';
import { exportPuzzlePdf, solvePuzzle, validatePuzzle, type SolveResponse } from './api/client';
import { boardSignature, getRangeLabel } from './domain/puzzle';
import { mergeIssues, validatePuzzleDocument, type ValidationIssue } from './domain/validation';
import ExportPanel from './features/export/ExportPanel';
import LanguageSwitcher from './features/language/LanguageSwitcher';
import PuzzleSetupPanel from './features/editor/PuzzleSetupPanel';
import SudokuGrid from './features/editor/SudokuGrid';
import SolutionTabs from './features/solve/SolutionTabs';
import SolvePanel from './features/solve/SolvePanel';
import { formatStatusMessage, type StatusState, useI18n } from './i18n';
import { usePuzzleStore } from './state/puzzleStore';

function sanitizeFileName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'sudoku';
}

export default function App() {
  const { language, copy } = useI18n();
  const store = usePuzzleStore();
  const {
    puzzle,
    solutionLimit,
    maxAddedBlueCircles,
    approvedSolutionIndex,
    changeVariant,
    changeSize,
    setName,
    setCreatedAt,
    setCell,
    toggleMarker,
    setSolutionLimit,
    setMaxAddedBlueCircles,
    setApprovedSolutionIndex,
    resetApproval,
  } = store;

  const [serverIssues, setServerIssues] = useState<ValidationIssue[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [solveResult, setSolveResult] = useState<SolveResponse | null>(null);
  const [strictSolutionIndex, setStrictSolutionIndex] = useState(0);
  const [relaxedSolutionIndex, setRelaxedSolutionIndex] = useState(0);
  const [isSolving, setIsSolving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [statusState, setStatusState] = useState<StatusState>({ key: 'initial' });

  const signature = boardSignature(puzzle);
  const statusMessage = useMemo(() => formatStatusMessage(language, statusState), [language, statusState]);

  const clientValidation = useMemo(() => validatePuzzleDocument(puzzle, language), [signature, language]);
  const issues = useMemo(
    () => mergeIssues(clientValidation.issues, serverIssues),
    [clientValidation, serverIssues],
  );

  useEffect(() => {
    resetApproval();
    setSolveResult(null);
    setStrictSolutionIndex(0);
    setRelaxedSolutionIndex(0);
    setStatusState({ key: 'puzzleUpdated' });
  }, [signature]);

  useEffect(() => {
    let ignore = false;
    setIsValidating(true);
    setValidationError(null);

    const timer = window.setTimeout(async () => {
      try {
        const response = await validatePuzzle(puzzle);
        if (!ignore) {
          setServerIssues(response.issues);
        }
      } catch (error) {
        if (!ignore) {
          setValidationError(error instanceof Error ? error.message : copy.errors.serverValidationFailed);
        }
      } finally {
        if (!ignore) {
          setIsValidating(false);
        }
      }
    }, 240);

    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [puzzle, signature, copy]);

  const approvedSolution =
    solveResult && approvedSolutionIndex !== null ? solveResult.solutions[approvedSolutionIndex] : null;

  const canExport = Boolean(solveResult?.is_unique && approvedSolution);

  async function handleSolve() {
    setIsSolving(true);
    setValidationError(null);

    try {
      const result = await solvePuzzle(puzzle, solutionLimit, maxAddedBlueCircles);
      setSolveResult(result);
      setServerIssues(result.validation.issues);
      setStrictSolutionIndex(0);
      setRelaxedSolutionIndex(0);
      resetApproval();

      if (!result.has_solution && !result.relaxed?.has_solution) {
        setStatusState({ key: 'noSolution' });
        return;
      }

      if (result.relaxed?.has_solution) {
        if (!result.has_solution) {
          setStatusState({ key: 'strictNoSolutionRelaxedPossible', limit: maxAddedBlueCircles });
          return;
        }

        setStatusState({ key: 'bothResultSetsReady', limit: maxAddedBlueCircles });
        return;
      }

      if (result.is_unique) {
        setStatusState({ key: 'strictUnique' });
        return;
      }

      setStatusState({ key: 'strictMultiple' });
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : copy.errors.solveRequestFailed);
    } finally {
      setIsSolving(false);
    }
  }

  function handleContinueEditing() {
    resetApproval();
    setStatusState({ key: 'continueEditing' });
  }

  function handleApprove() {
    if (!solveResult?.is_unique) {
      return;
    }

    setApprovedSolutionIndex(0);
    setStrictSolutionIndex(0);
    setRelaxedSolutionIndex(0);
    setStatusState({ key: 'approved' });
  }

  async function handleExport() {
    if (!approvedSolution) {
      return;
    }

    setIsExporting(true);

    try {
      const blob = await exportPuzzlePdf({
        puzzle,
        approved_solution: approvedSolution,
        solution_index: approvedSolutionIndex ?? 0,
        language,
      });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${sanitizeFileName(puzzle.name)}.pdf`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setStatusState({ key: 'exportReady' });
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : copy.errors.pdfExportFailed);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="reference-panel paper-card">
        <p className="eyebrow">{copy.app.referenceEyebrow}</p>
        <h2>{copy.app.referenceTitle}</h2>
        <p className="supporting-copy">{copy.app.referenceCopy}</p>
        <img className="reference-image" src="/examplesudoku.png" alt="Sudoku export reference" />
      </aside>

      <main className="workspace">
        <header className="hero paper-card">
          <div className="hero-topbar">
            <div>
              <p className="eyebrow">{copy.app.heroEyebrow}</p>
              <h1>{copy.app.heroTitle}</h1>
            </div>
            <LanguageSwitcher />
          </div>
          <p className="supporting-copy">{copy.app.heroCopy}</p>
          <div className="hero-meta">
            <span>{puzzle.variant === 'classic' ? copy.app.classicMode : copy.app.consecutiveMode}</span>
            <span>{puzzle.size}x{puzzle.size}</span>
            <span>{getRangeLabel(puzzle)}</span>
          </div>
        </header>

        <section className="paper-card">
          <PuzzleSetupPanel
            puzzle={puzzle}
            solutionLimit={solutionLimit}
            maxAddedBlueCircles={maxAddedBlueCircles}
            onVariantChange={changeVariant}
            onSizeChange={changeSize}
            onNameChange={setName}
            onDateChange={setCreatedAt}
            onSolutionLimitChange={setSolutionLimit}
            onMaxAddedBlueCirclesChange={setMaxAddedBlueCircles}
          />
        </section>

        <section className="paper-card board-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{copy.app.editorEyebrow}</p>
              <h2>{copy.app.editorTitle}</h2>
            </div>
            <div className="issue-summary">
              <span className={issues.length > 0 ? 'issue-chip issue-chip-active' : 'issue-chip'}>
                {issues.length} {copy.solvePanel.issueLabel}
              </span>
              <span className={isValidating ? 'issue-chip issue-chip-active' : 'issue-chip'}>
                {isValidating ? copy.solvePanel.validatingLabel : copy.solvePanel.readyLabel}
              </span>
            </div>
          </div>
          <SudokuGrid puzzle={puzzle} issues={issues} onCellChange={setCell} onToggleEdge={toggleMarker} />
        </section>

        <section className="paper-card">
          <SolvePanel
            isSolving={isSolving}
            isValidating={isValidating}
            validationError={validationError}
            statusMessage={statusMessage}
            issueCount={issues.length}
            solveResult={solveResult}
            onSolve={handleSolve}
            onContinueEditing={handleContinueEditing}
            onApprove={handleApprove}
          />
        </section>

        {solveResult ? (
          <>
            <section className="paper-card">
              <SolutionTabs
                puzzle={puzzle}
                eyebrow={copy.solutionTabs.strictEyebrow}
                title={copy.solutionTabs.strictTitle}
                description={copy.solutionTabs.strictDescription}
                emptyMessage={copy.solutionTabs.strictEmpty}
                result={solveResult}
                selectedSolutionIndex={strictSolutionIndex}
                showInferredMarkers={false}
                onSelectSolution={(index) => {
                  setStrictSolutionIndex(index);
                  setStatusState({ key: 'strictSolutionSelected', index: index + 1 });
                }}
              />
            </section>

            {solveResult.relaxed ? (
              <section className="paper-card">
                <SolutionTabs
                  puzzle={puzzle}
                  eyebrow={copy.solutionTabs.relaxedEyebrow}
                  title={copy.solutionTabs.relaxedTitle}
                  description={copy.solutionTabs.relaxedDescription(maxAddedBlueCircles)}
                  emptyMessage={copy.solutionTabs.relaxedEmpty}
                  result={solveResult.relaxed}
                  selectedSolutionIndex={relaxedSolutionIndex}
                  showInferredMarkers={true}
                  onSelectSolution={(index) => {
                    setRelaxedSolutionIndex(index);
                    setStatusState({ key: 'relaxedSolutionSelected', index: index + 1 });
                  }}
                />
              </section>
            ) : null}
          </>
        ) : null}

        {canExport ? (
          <section className="paper-card">
            <ExportPanel
              puzzleName={puzzle.name}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </section>
        ) : null}
      </main>
    </div>
  );
}
