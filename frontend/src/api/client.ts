import type { PuzzleDocument } from '../domain/puzzle';
import type { ValidationResponse } from '../domain/validation';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export interface SolveResponse {
  has_solution: boolean;
  solution_count_found: number;
  truncated: boolean;
  is_unique: boolean;
  solutions: number[][][];
  validation: ValidationResponse;
  relaxed?: SolveResultSet | null;
}

export interface SolveResultSet {
  has_solution: boolean;
  solution_count_found: number;
  truncated: boolean;
  is_unique: boolean;
  solutions: number[][][];
  validation: ValidationResponse;
}

export interface ExportRequest {
  puzzle: PuzzleDocument;
  approved_solution: number[][];
  solution_index: number;
}

async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Istek basarisiz: ${response.status}`);
  }

  return (await response.json()) as T;
}

export function validatePuzzle(puzzle: PuzzleDocument): Promise<ValidationResponse> {
  return requestJson<ValidationResponse>('/api/validate', {
    method: 'POST',
    body: JSON.stringify(puzzle),
  });
}

export function solvePuzzle(
  puzzle: PuzzleDocument,
  solutionLimit: number,
  maxAddedBlueCircles: number,
): Promise<SolveResponse> {
  return requestJson<SolveResponse>('/api/solve', {
    method: 'POST',
    body: JSON.stringify({
      puzzle,
      solution_limit: solutionLimit,
      max_added_blue_circles: maxAddedBlueCircles,
    }),
  });
}

export async function exportPuzzlePdf(request: ExportRequest): Promise<Blob> {
  const response = await fetch(`${API_BASE}/api/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `PDF olusturulamadi: ${response.status}`);
  }

  return response.blob();
}
