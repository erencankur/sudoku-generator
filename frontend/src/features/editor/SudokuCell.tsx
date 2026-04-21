interface SudokuCellProps {
  value: number | null;
  size: number;
  invalid: boolean;
  onChange: (rawValue: string) => void;
}

export default function SudokuCell({ value, size, invalid, onChange }: SudokuCellProps) {
  return (
    <input
      className={invalid ? 'sudoku-cell invalid' : 'sudoku-cell'}
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={1}
      value={value ?? ''}
      onChange={(event) => {
        const nextValue = event.target.value.replace(/[^0-9]/g, '').slice(0, 1);

        if (nextValue.length === 0) {
          onChange('');
          return;
        }

        const numericValue = Number.parseInt(nextValue, 10);
        if (Number.isNaN(numericValue) || numericValue > size) {
          return;
        }

        onChange(nextValue);
      }}
    />
  );
}
