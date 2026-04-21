import { useEffect, useMemo, useState } from 'react';
import { exportPuzzlePdf, solvePuzzle, validatePuzzle, type SolveResponse } from './api/client';
import { boardSignature, getRangeLabel } from './domain/puzzle';
import { mergeIssues, validatePuzzleDocument, type ValidationIssue } from './domain/validation';
import ExportPanel from './features/export/ExportPanel';
import PuzzleSetupPanel from './features/editor/PuzzleSetupPanel';
import SudokuGrid from './features/editor/SudokuGrid';
import SolutionTabs from './features/solve/SolutionTabs';
import SolvePanel from './features/solve/SolvePanel';
import { usePuzzleStore } from './state/puzzleStore';

function sanitizeFileName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'sudoku';
}

export default function App() {
  const store = usePuzzleStore();
  const {
    puzzle,
    solutionLimit,
    approvedSolutionIndex,
    changeVariant,
    changeSize,
    setName,
    setCreatedAt,
    setCell,
    toggleMarker,
    setSolutionLimit,
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
  const [statusMessage, setStatusMessage] = useState(
    'Bulmacayi hazirlayin. Cozumden sonra karar butonlari otomatik olarak duruma gore gorunecek.',
  );

  const signature = boardSignature(puzzle);

  const clientValidation = useMemo(() => validatePuzzleDocument(puzzle), [signature]);
  const issues = useMemo(
    () => mergeIssues(clientValidation.issues, serverIssues),
    [clientValidation, serverIssues],
  );

  useEffect(() => {
    resetApproval();
    setSolveResult(null);
    setStrictSolutionIndex(0);
    setRelaxedSolutionIndex(0);
    setStatusMessage('Bulmaca guncellendi. Cozum sonucunu yenilemek icin tekrar Cozum Yap kullanin.');
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
          setValidationError(error instanceof Error ? error.message : 'Sunucu dogrulamasi basarisiz.');
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
  }, [puzzle, signature]);

  const approvedSolution =
    solveResult && approvedSolutionIndex !== null ? solveResult.solutions[approvedSolutionIndex] : null;

  const canExport = Boolean(solveResult?.is_unique && approvedSolution);

  async function handleSolve() {
    setIsSolving(true);
    setValidationError(null);

    try {
      const result = await solvePuzzle(puzzle, solutionLimit);
      setSolveResult(result);
      setServerIssues(result.validation.issues);
      setStrictSolutionIndex(0);
      setRelaxedSolutionIndex(0);
      resetApproval();

      if (!result.has_solution && !result.relaxed?.has_solution) {
        setStatusMessage('Bu girdi ile gecerli bir cozum bulunamadi. Kurallari veya verilen sayilari gozden gecirin.');
        return;
      }

      if (result.relaxed?.has_solution) {
        if (!result.has_solution) {
          setStatusMessage('Kesin yorumda cozum yok. Mavi daireli yorum icin cozumler hazir. Iki bolumu de asagida inceleyebilirsiniz.');
          return;
        }

        setStatusMessage('Kesin yorum ve mavi daireli yorum icin cozumler hazir. Iki bolumu de asagida inceleyebilirsiniz.');
        return;
      }

      if (result.is_unique) {
        setStatusMessage('Tek cozum bulundu. Isterseniz Soruyu Gelistirmeye Devam Et ile geri donebilir ya da Soruyu Onayla ile export akisini acabilirsiniz.');
        return;
      }

      setStatusMessage('Birden fazla cozum bulundu. Tek buton olarak Soruyu Gelistirmeye Devam Et gorunur; bulmacayi daha belirgin hale getirmeniz gerekir.');
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Cozum istegi basarisiz.');
    } finally {
      setIsSolving(false);
    }
  }

  function handleContinueEditing() {
    resetApproval();
    setStatusMessage('Editor moduna geri donuldu. Grid uzerinde sayi veya ardısik isaretleri ekleyerek bulmacayi gelistirebilirsiniz.');
  }

  function handleApprove() {
    if (!solveResult?.is_unique) {
      return;
    }

    setApprovedSolutionIndex(0);
    setStrictSolutionIndex(0);
    setRelaxedSolutionIndex(0);
    setStatusMessage('Bulmaca onaylandi. PDF export artik kullanilabilir.');
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
      });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${sanitizeFileName(puzzle.name)}.pdf`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setStatusMessage('PDF indirilmeye hazirlandi. Tasarim examplesudoku.png referansina gore uretildi.');
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'PDF export basarisiz.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="reference-panel paper-card">
        <p className="eyebrow">Referans Goruntu</p>
        <h2>PDF Tasarim Yonelimi</h2>
        <p className="supporting-copy">
          Uretilen puzzle ve cozum sayfalari, asagidaki gorseldeki kagit duzeni, ince cizgi dili ve merkezlenmis kompozisyonu referans alir.
        </p>
        <img className="reference-image" src="/examplesudoku.png" alt="Sudoku export reference" />
      </aside>

      <main className="workspace">
        <header className="hero paper-card">
          <p className="eyebrow">Local Sudoku Generator</p>
          <h1>Kural Kur, Coz, Onayla, PDF Al</h1>
          <p className="supporting-copy">
            Klasik ve ardısik sudoku bulmacalari icin ayni editor kullanilir. Solve sonucu tek cozum verirse iki karar butonu, birden fazla cozum verirse yalnizca gelistirme butonu acilir.
          </p>
          <div className="hero-meta">
            <span>{puzzle.variant === 'classic' ? 'Klasik mod' : 'Ardisik mod'}</span>
            <span>{puzzle.size}x{puzzle.size}</span>
            <span>{getRangeLabel(puzzle)}</span>
          </div>
        </header>

        <section className="paper-card">
          <PuzzleSetupPanel
            puzzle={puzzle}
            solutionLimit={solutionLimit}
            onVariantChange={changeVariant}
            onSizeChange={changeSize}
            onNameChange={setName}
            onDateChange={setCreatedAt}
            onSolutionLimitChange={setSolutionLimit}
          />
        </section>

        <section className="paper-card board-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Editor</p>
              <h2>Grid ve Kenar Isaretleri</h2>
            </div>
            <div className="issue-summary">
              <span className={issues.length > 0 ? 'issue-chip issue-chip-active' : 'issue-chip'}>
                {issues.length} issue
              </span>
              <span className={isValidating ? 'issue-chip issue-chip-active' : 'issue-chip'}>
                {isValidating ? 'Sunucu kontrolu' : 'Client + server kontrolu'}
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
                eyebrow={puzzle.variant === 'consecutive' ? '1. Bolum' : 'Tum Cozumler'}
                title={puzzle.variant === 'consecutive' ? 'Mevcut Tabloya Gore Cozumler' : 'Bulunan Cozumleri Incele'}
                description={
                  puzzle.variant === 'consecutive'
                    ? 'Bu bolum, girdiginiz tabloyu ve mavi daireleri mevcut haliyle birebir kabul eder.'
                    : 'Bu bolum, bulunan tum cozumleri mevcut tablo kurallariyla listeler.'
                }
                emptyMessage={
                  puzzle.variant === 'consecutive'
                    ? 'Bu kesin yorum altinda cozum bulunamadi.'
                    : 'Bu bulmaca icin cozum bulunamadi.'
                }
                result={solveResult}
                selectedSolutionIndex={strictSolutionIndex}
                showInferredMarkers={false}
                onSelectSolution={(index) => {
                  setStrictSolutionIndex(index);
                  setStatusMessage(`Kesin yorumda Cozum ${index + 1} goruntuleniyor.`);
                }}
              />
            </section>

            {solveResult.relaxed ? (
              <section className="paper-card">
                <SolutionTabs
                  puzzle={puzzle}
                  eyebrow="2. Bolum"
                  title="Mavi Daireleri Kabul Eden Cozumler"
                  description="Bu bolum, mavi daireleri zorunlu kabul eder; isaretlenmemis komsuluklar ise var ya da yok olabilir. Cikan yeni mavi daireler de burada gorunur."
                  emptyMessage="Bu esnek yorum altinda cozum bulunamadi."
                  result={solveResult.relaxed}
                  selectedSolutionIndex={relaxedSolutionIndex}
                  showInferredMarkers={true}
                  onSelectSolution={(index) => {
                    setRelaxedSolutionIndex(index);
                    setStatusMessage(`Esnek yorumda Cozum ${index + 1} goruntuleniyor.`);
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
