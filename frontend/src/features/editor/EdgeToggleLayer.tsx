import type { ConsecutiveEdgeState, EdgeCoordinate } from '../../domain/puzzle';

interface EdgeToggleLayerProps {
  orientation: EdgeCoordinate['orientation'];
  state: ConsecutiveEdgeState;
  invalid: boolean;
  onToggle: () => void;
}

function getStateLabel(state: ConsecutiveEdgeState): string {
  if (state === 1) {
    return 'Mavi daire koy';
  }

  if (state === -1) {
    return 'Kesinlikle koyma';
  }

  return 'Bos birak';
}

export default function EdgeToggleLayer({
  orientation,
  state,
  invalid,
  onToggle,
}: EdgeToggleLayerProps) {
  const classes = [
    'edge-toggle',
    orientation === 'horizontal' ? 'edge-toggle-horizontal' : 'edge-toggle-vertical',
    state === 1 ? 'edge-toggle-required' : state === -1 ? 'edge-toggle-forbidden' : 'edge-toggle-empty',
    invalid ? 'invalid' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const orientationLabel = orientation === 'horizontal' ? 'Yatay' : 'Dikey';

  return (
    <button
      type="button"
      className={classes}
      onClick={onToggle}
      aria-label={`${orientationLabel} ardisik isareti. ${getStateLabel(state)}.`}
      title={`${orientationLabel} ardisik isareti: ${getStateLabel(state)}`}
    />
  );
}
