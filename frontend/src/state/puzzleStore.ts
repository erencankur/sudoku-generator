import { useState } from 'react';
import {
  createEmptyPuzzle,
  toggleEdge,
  updateCellValue,
  withVariantAndSize,
  type EdgeCoordinate,
  type PuzzleDocument,
  type PuzzleSize,
  type PuzzleVariant,
} from '../domain/puzzle';

export const DEFAULT_SOLUTION_LIMIT = 12;
export const DEFAULT_MAX_ADDED_BLUE_CIRCLES = 144;

export function usePuzzleStore() {
  const [puzzle, setPuzzle] = useState<PuzzleDocument>(() => createEmptyPuzzle('classic', 9));
  const [solutionLimit, setSolutionLimit] = useState(DEFAULT_SOLUTION_LIMIT);
  const [maxAddedBlueCircles, setMaxAddedBlueCircles] = useState(DEFAULT_MAX_ADDED_BLUE_CIRCLES);
  const [approvedSolutionIndex, setApprovedSolutionIndex] = useState<number | null>(null);

  function changeVariant(variant: PuzzleVariant) {
    setPuzzle((current) => withVariantAndSize(current, variant, current.size));
    setApprovedSolutionIndex(null);
  }

  function changeSize(size: PuzzleSize) {
    setPuzzle((current) => withVariantAndSize(current, current.variant, size));
    setApprovedSolutionIndex(null);
  }

  function setName(name: string) {
    setPuzzle((current) => ({ ...current, name }));
  }

  function setCreatedAt(createdAt: string) {
    setPuzzle((current) => ({ ...current, created_at: createdAt }));
  }

  function setCell(row: number, col: number, rawValue: string) {
    setPuzzle((current) => updateCellValue(current, row, col, rawValue));
    setApprovedSolutionIndex(null);
  }

  function toggleMarker(orientation: EdgeCoordinate['orientation'], row: number, col: number) {
    setPuzzle((current) => toggleEdge(current, orientation, row, col));
    setApprovedSolutionIndex(null);
  }

  function resetApproval() {
    setApprovedSolutionIndex(null);
  }

  return {
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
  };
}