interface ExportPanelProps {
  puzzleName: string;
  isExporting: boolean;
  onExport: () => void;
}

export default function ExportPanel({
  puzzleName,
  isExporting,
  onExport,
}: ExportPanelProps) {
  return (
    <div className="export-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Final Adim</p>
          <h2>Onayli Puzzle PDF</h2>
        </div>
      </div>

      <p className="supporting-copy">
        <strong>{puzzleName}</strong> icin puzzle ve cozum sayfalari, examplesudoku.png referansina gore iki sayfali PDF olarak uretilir.
      </p>

      <button type="button" className="primary-button" onClick={onExport} disabled={isExporting}>
        {isExporting ? 'PDF Hazirlaniyor...' : 'PDF Olustur'}
      </button>
    </div>
  );
}
