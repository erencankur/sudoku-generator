import type { PuzzleDocument, PuzzleSize, PuzzleVariant } from '../../domain/puzzle';

interface PuzzleSetupPanelProps {
  puzzle: PuzzleDocument;
  solutionLimit: number;
  onVariantChange: (variant: PuzzleVariant) => void;
  onSizeChange: (size: PuzzleSize) => void;
  onNameChange: (name: string) => void;
  onDateChange: (date: string) => void;
  onSolutionLimitChange: (limit: number) => void;
}

export default function PuzzleSetupPanel({
  puzzle,
  solutionLimit,
  onVariantChange,
  onSizeChange,
  onNameChange,
  onDateChange,
  onSolutionLimitChange,
}: PuzzleSetupPanelProps) {
  return (
    <div className="setup-grid">
      <div className="setup-group">
        <label className="field-label">Bulmaca adi</label>
        <input
          className="text-input"
          type="text"
          value={puzzle.name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Bulmaca basligi"
        />
      </div>

      <div className="setup-group">
        <label className="field-label">Olusturma tarihi</label>
        <input
          className="text-input"
          type="date"
          value={puzzle.created_at}
          onChange={(event) => onDateChange(event.target.value)}
        />
      </div>

      <div className="setup-group">
        <label className="field-label">Variant secimi</label>
        <div className="segmented-control">
          {(['classic', 'consecutive'] as const).map((variant) => (
            <button
              key={variant}
              type="button"
              className={variant === puzzle.variant ? 'segment active' : 'segment'}
              onClick={() => onVariantChange(variant)}
            >
              {variant === 'classic' ? 'Classic' : 'Consecutive'}
            </button>
          ))}
        </div>
      </div>

      <div className="setup-group">
        <label className="field-label">Grid boyutu</label>
        <div className="segmented-control">
          {([6, 9] as const).map((size) => (
            <button
              key={size}
              type="button"
              className={size === puzzle.size ? 'segment active' : 'segment'}
              onClick={() => onSizeChange(size)}
            >
              {size}x{size}
            </button>
          ))}
        </div>
      </div>

      <div className="setup-group">
        <label className="field-label">Cozum limiti</label>
        <input
          className="text-input"
          type="number"
          min={1}
          max={40}
          value={solutionLimit}
          onChange={(event) => {
            const parsed = Number.parseInt(event.target.value, 10);
            onSolutionLimitChange(Number.isNaN(parsed) ? 1 : Math.max(1, Math.min(parsed, 40)));
          }}
        />
      </div>
    </div>
  );
}
