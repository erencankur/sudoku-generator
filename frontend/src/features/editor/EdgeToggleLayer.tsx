import type { EdgeCoordinate } from '../../domain/puzzle';

interface EdgeToggleLayerProps {
  orientation: EdgeCoordinate['orientation'];
  active: boolean;
  invalid: boolean;
  onToggle: () => void;
}

export default function EdgeToggleLayer({
  orientation,
  active,
  invalid,
  onToggle,
}: EdgeToggleLayerProps) {
  const classes = [
    'edge-toggle',
    orientation === 'horizontal' ? 'edge-toggle-horizontal' : 'edge-toggle-vertical',
    active ? 'active' : '',
    invalid ? 'invalid' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onToggle}
      aria-label={orientation === 'horizontal' ? 'Yatay ardısik isareti' : 'Dikey ardısik isareti'}
    />
  );
}
