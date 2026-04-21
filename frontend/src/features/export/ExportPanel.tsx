import { useI18n } from '../../i18n';

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
  const { copy } = useI18n();

  return (
    <div className="export-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{copy.exportPanel.eyebrow}</p>
          <h2>{copy.exportPanel.title}</h2>
        </div>
      </div>

      <p className="supporting-copy">
        {copy.exportPanel.descriptionPrefix}
        <strong>{puzzleName}</strong>
        {copy.exportPanel.descriptionSuffix}
      </p>

      <button type="button" className="primary-button" onClick={onExport} disabled={isExporting}>
        {isExporting ? copy.exportPanel.loading : copy.exportPanel.button}
      </button>
    </div>
  );
}
