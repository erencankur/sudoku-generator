import type { ConsecutiveEdgeState, EdgeCoordinate } from '../../domain/puzzle';
import { useI18n } from '../../i18n';

interface EdgeToggleLayerProps {
  orientation: EdgeCoordinate['orientation'];
  state: ConsecutiveEdgeState;
  invalid: boolean;
  onToggle: () => void;
}

export default function EdgeToggleLayer({
  orientation,
  state,
  invalid,
  onToggle,
}: EdgeToggleLayerProps) {
  const { copy } = useI18n();
  const classes = [
    'edge-toggle',
    orientation === 'horizontal' ? 'edge-toggle-horizontal' : 'edge-toggle-vertical',
    state === 1 ? 'edge-toggle-required' : state === -1 ? 'edge-toggle-forbidden' : 'edge-toggle-empty',
    invalid ? 'invalid' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const orientationLabel = orientation === 'horizontal' ? copy.editorLegend.horizontalAria : copy.editorLegend.verticalAria;
  const stateLabel = state === 1 ? copy.editorLegend.required : state === -1 ? copy.editorLegend.forbidden : copy.editorLegend.empty;

  return (
    <button
      type="button"
      className={classes}
      onClick={onToggle}
      aria-label={`${orientationLabel}. ${stateLabel}.`}
      title={`${orientationLabel}: ${stateLabel}`}
    />
  );
}
