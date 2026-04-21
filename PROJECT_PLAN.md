# Sudoku Generator Project Plan

## 1. Confirmed Scope

- Application type: local-only web application running on the user's machine.
- Puzzle variants: Classic Sudoku and Consecutive Sudoku.
- Supported sizes:
  - 6x6 with 2x3 bold regions and allowed values 1-6.
  - 9x9 with 3x3 bold regions and allowed values 1-9.
- Frontend stack: React.
- Backend stack: FastAPI.
- Solving engine: pure Python with NumPy support.
- PDF engine: ReportLab with coordinate-driven drawing.
- Persistence: no database; stateless workflow.
- Solver enumeration policy: configurable solution cap for performance safety.
- Multi-solution export policy: the UI shows all found solutions up to the cap, and the PDF exports one user-selected solution page.
- Solve-result decision policy:
  - If exactly one solution is found, show two actions: `Soruyu Geliştirmeye Devam Et` and `Soruyu Onayla`.
  - If multiple solutions are found, show only `Soruyu Geliştirmeye Devam Et`.
- PDF visual reference: align the export layout with `examplesudoku.png`, including centered title, strong outer/region borders, light inner grid lines, edge circles, footer rule, footer labels, and date placement.

## 2. Architecture Decisions

### Decision 1: Use a two-part local architecture

Use a React frontend for the interactive editor and a FastAPI backend for validation, solving, and PDF export.

Why:

- React is the better fit for an editable grid, edge toggles, live warnings, and solution browsing.
- FastAPI keeps solver and PDF responsibilities in Python, which matches the required algorithm and ReportLab stack.
- The browser remains responsive while solver and export work happen server-side.

Consequence:

- In development, frontend and backend can run as separate local processes.
- In local release mode, FastAPI should serve the built frontend assets so the app can be started as a single local service.

### Decision 2: Keep the application stateless

The application will not store puzzles in a database. The current puzzle lives in browser state, and export requests send the full puzzle document to the backend.

Why:

- The app is local-only.
- Database setup would add operational weight without solving a stated requirement.
- Stateless requests simplify testing and export reproducibility.

Consequence:

- Puzzle save/load, if added later, should be file-based JSON import/export rather than database-driven.

### Decision 3: Use a shared puzzle document as the system contract

Both frontend and backend will speak through a single puzzle document shape.

Why:

- This avoids drift between what the editor can build, what the solver can validate, and what the PDF renderer can draw.
- It gives a stable base for validation, solve, and export APIs.

Consequence:

- Define the schema first and treat it as the source of truth for the project.

### Decision 4: Split validation into fast client validation and authoritative backend validation

The frontend should validate incrementally on every edit for instant feedback. The backend should revalidate the same document before solve and export.

Why:

- Live highlighting must feel immediate.
- Solver and export must never trust client-only checks.

Consequence:

- The same rule set must exist in both a UI-oriented incremental form and a backend authoritative form.
- Validation results should reference exact cells and exact edge markers so the UI can highlight the right elements.

### Decision 5: Build the solver around pluggable constraints

Implement a base Sudoku solver for row, column, and region constraints, then attach a consecutive-constraint module.

Why:

- The classic and consecutive variants share most of the solving logic.
- A constraint-based structure is easier to test and extend than embedding variant rules directly into backtracking branches.

Consequence:

- The solver core should operate on a normalized board definition.
- The consecutive module should express both rules:
  - If an edge marker exists, adjacent values must differ by exactly 1.
  - If no edge marker exists, adjacent values must not differ by exactly 1.

### Decision 6: Generate PDFs only on the backend

All final layout drawing will happen in Python with ReportLab.

Why:

- The requirement explicitly calls for millimeter-precise coordinates.
- The reference layout is print-oriented and should not depend on browser rendering differences.
- ReportLab is the correct place for region borders, footer line work, metadata placement, and edge-circle coordinates.

Consequence:

- The PDF layer needs its own layout constants for 6x6 and 9x9 boards.
- The exported look should match the reference image rather than the web editor one-to-one.

### Decision 7: Use a configurable solution cap

The solver will enumerate solutions up to a configurable maximum and report whether the result was truncated.

Why:

- Consecutive and under-constrained puzzles can produce large search spaces.
- The UI needs deterministic behavior in local use.

Consequence:

- The solve response must include both `solution_count_found` and `truncated`.
- The UI must explain when the cap was reached.

### Decision 8: Gate export through uniqueness approval

The UI should only expose the final approval path when the solver reports exactly one solution.

Why:

- A puzzle intended for publication should only be finalized when uniqueness is confirmed.
- The UX should push the user back into editing when the current puzzle is still ambiguous.

Consequence:

- `Soruyu Onayla` is only rendered for the single-solution case.
- `Soruyu Geliştirmeye Devam Et` is rendered for both single-solution and multi-solution cases and returns the user to editing/refinement.
- Export should remain blocked until a single solution is selected from a unique solve result.

## 3. Core Domain Model

The project should define one normalized puzzle document early and keep every layer aligned to it.

```json
{
  "name": "My Puzzle",
  "created_at": "2026-04-21",
  "variant": "classic | consecutive",
  "size": 6,
  "region_shape": { "rows": 2, "cols": 3 },
  "grid": [
    [1, null, 2, null, null, null],
    [null, 3, null, null, null, null]
  ],
  "consecutive_edges": {
    "horizontal": [
      [false, false, true, false, false]
    ],
    "vertical": [
      [false, false, false, true, false, false]
    ]
  }
}
```

Supporting rules:

- `grid` uses `null` for empty cells.
- `horizontal` stores row-wise left-right borders, shape `size x (size - 1)`.
- `vertical` stores top-bottom borders, shape `(size - 1) x size`.
- Region shape is derived from size but should still be explicit in backend normalization.
- Export requests should additionally include the selected solution index.

Validation result shape:

```json
{
  "is_valid": false,
  "issues": [
    {
      "type": "row_duplicate | column_duplicate | region_duplicate | consecutive_violation | non_consecutive_violation",
      "cells": [[0, 0], [0, 2]],
      "edges": [{ "orientation": "horizontal", "row": 0, "col": 2 }],
      "message": "Values conflict in row 1"
    }
  ]
}
```

Solve result shape:

```json
{
  "has_solution": true,
  "solution_count_found": 3,
  "truncated": false,
  "solutions": [
    [[1, 4, 2, 3, 5, 6]]
  ]
}
```

## 4. Proposed Folder Structure

```text
sudoku-generator/
  README.md
  PROJECT_PLAN.md
  examplesudoku.png
  frontend/
    package.json
    tsconfig.json
    vite.config.ts
    src/
      main.tsx
      App.tsx
      api/
        client.ts
      domain/
        puzzle.ts
        validation.ts
      features/
        editor/
          PuzzleSetupPanel.tsx
          SudokuGrid.tsx
          SudokuCell.tsx
          EdgeToggleLayer.tsx
          ValidationHighlights.tsx
        solve/
          SolvePanel.tsx
          SolutionTabs.tsx
        export/
          ExportPanel.tsx
      state/
        puzzleStore.ts
      styles/
        theme.css
        layout.css
  backend/
    pyproject.toml
    app/
      main.py
      api/
        routes/
          health.py
          validate.py
          solve.py
          export.py
      schemas/
        puzzle.py
        validation.py
        solve.py
        export.py
      domain/
        board.py
        regions.py
        consecutive.py
      services/
        validation_service.py
        solve_service.py
        export_service.py
      solver/
        constraints.py
        candidates.py
        backtracking.py
        enumerator.py
      pdf/
        layout.py
        draw_grid.py
        draw_metadata.py
        draw_edges.py
        draw_solution.py
      tests/
        unit/
        integration/
```

Notes on structure:

- The frontend is isolated around editor, solve, and export flows instead of generic component buckets.
- The backend separates API transport models from solver and PDF internals.
- The PDF package is intentionally independent from the solver package so rendering logic remains testable and deterministic.

## 5. API Surface

### `GET /api/health`

Purpose: local readiness check.

### `POST /api/validate`

Request: puzzle document.

Response: validation issues for current entries and edge rules.

Usage:

- Called after edits when backend verification is needed.
- Can also be used before solve and export.

### `POST /api/solve`

Request:

- puzzle document
- `solution_limit`

Response:

- whether at least one solution exists
- solutions found up to the cap
- whether the list was truncated

### `POST /api/export`

Request:

- puzzle document
- selected solution index
- export metadata such as title override if needed

Response:

- generated PDF file stream

## 6. UX and Interaction Plan

### Editor flow

1. User selects variant: Classic or Consecutive.
2. User selects size: 6x6 or 9x9.
3. The app creates an empty board with matching region configuration.
4. The user enters digits into cells.
5. For consecutive puzzles, the user toggles edge markers directly on cell borders.
6. The app highlights conflicting cells and related edges immediately.
7. The user clicks `Try to Solve`.
8. The app reports whether a solution exists, how many were found up to the configured cap, and shows each found solution.
9. If exactly one solution exists, the app shows `Soruyu Geliştirmeye Devam Et` and `Soruyu Onayla`.
10. If more than one solution exists, the app shows only `Soruyu Geliştirmeye Devam Et`.
11. `Soruyu Geliştirmeye Devam Et` returns focus to the editor so the user can add more givens or consecutive markers.
12. `Soruyu Onayla` reveals the export step and locks the current solution as the approved solution for PDF generation.
13. The backend generates a two-page PDF: puzzle page plus approved solution page.

### Real-time validation behavior

- Cell edits should re-check only affected row, column, region, and adjacent edges.
- Edge toggles should re-check only the two adjacent cells involved.
- Invalid cells should receive a red warning state.
- Invalid consecutive edges should also receive a visible warning state so the user sees whether the problem comes from a marker or a digit placement.

### Consecutive edge interaction model

- Edges must be clickable targets, not tiny decorative icons.
- The click target can be larger than the final rendered circle for usability.
- The web editor may use a clear active color for selected edges, but PDF export should follow the neutral reference styling from `examplesudoku.png`.

## 7. PDF Layout Plan

The PDF layer should be treated as a print composition system, not a screenshot export.

Reference-driven layout requirements:

- Large centered title at top.
- Sudoku board placed centrally with generous whitespace.
- Thin inner grid lines and thicker outer/region borders.
- Consecutive edge circles placed exactly on border midpoints.
- Variant label near the lower-left area of the board region.
- Range label such as `{1-6}` or `{1-9}` near the lower-right area.
- Footer rule across the page.
- Footer left text with application label.
- Footer right text with creation date.

Renderer decisions:

- Use millimeters as the internal layout unit.
- Keep layout constants in one module so spacing can be tuned without editing drawing code.
- Draw puzzle page and solution page from the same layout engine, changing only title and grid contents.
- Use deterministic font sizing rules for 6x6 versus 9x9 boards.
- Keep the export pipeline vector-based end to end; do not rasterize the board before writing the PDF.

## 8. Development Phases

### Phase 1: Repository foundation

Goal: create the local development skeleton.

Tasks:

1. Create `frontend/` and `backend/` roots.
2. Initialize the React app and Python project.
3. Add local run scripts for frontend dev, backend dev, and combined local start.
4. Add formatting, linting, and test commands.

Deliverables:

- runnable local frontend
- runnable local FastAPI backend
- documented startup steps

Exit criteria:

- one command sequence starts both services locally
- health endpoint responds

### Phase 2: Domain model and contracts

Goal: freeze the shared puzzle document and API request/response schemas.

Tasks:

1. Define frontend TypeScript types for puzzle, validation issues, and solve results.
2. Define matching Pydantic schemas in FastAPI.
3. Define region configuration rules for 6x6 and 9x9.
4. Define the edge-coordinate model for consecutive markers.

Deliverables:

- stable shared contract
- sample payload fixtures for both puzzle types and both sizes

Exit criteria:

- every later phase can use the same schema without reinterpretation

### Phase 3: Core validation engine

Goal: implement authoritative rule checking before solving.

Tasks:

1. Implement row duplicate checks.
2. Implement column duplicate checks.
3. Implement region duplicate checks.
4. Implement consecutive and non-consecutive adjacency checks.
5. Return issue payloads with exact cell and edge references.

Deliverables:

- backend validation service
- unit tests covering valid and invalid cases for 6x6 and 9x9

Exit criteria:

- backend returns reliable issue maps for all supported rule types

### Phase 4: Solver engine

Goal: build a solver that can detect solvability and enumerate solutions up to the configured cap.

Tasks:

1. Build candidate generation for empty cells.
2. Add row, column, and region pruning.
3. Add consecutive pruning using edge constraints.
4. Implement backtracking enumeration with configurable limit.
5. Return all found solutions up to the cap and the truncation flag.

Deliverables:

- solver core
- classic and consecutive solver support
- solve benchmarks for representative 6x6 and 9x9 inputs

Exit criteria:

- solver distinguishes no solution, single solution, and multiple-solution cases
- cap behavior is explicit and tested

### Phase 5: FastAPI application layer

Goal: expose validation, solve, and export services through stable endpoints.

Tasks:

1. Implement route handlers and schema validation.
2. Add error handling for malformed payloads and unsupported combinations.
3. Add integration tests for the three main endpoints.
4. Add CORS configuration for local frontend development only.

Deliverables:

- local API surface
- endpoint tests

Exit criteria:

- frontend can consume the full workflow without direct solver imports

### Phase 6: React editor and live validation UX

Goal: create the puzzle-building experience.

Tasks:

1. Build variant and size selectors.
2. Build the editable board for 6x6 and 9x9.
3. Build clickable edge targets for consecutive mode.
4. Implement immediate client-side conflict highlighting.
5. Add backend validation sync before solve/export actions.

Deliverables:

- usable local editor
- visible red warnings for invalid states

Exit criteria:

- user can build any supported puzzle entirely from the browser

### Phase 7: Solve results workflow

Goal: let the user inspect solver outcomes and choose the exportable solution.

Tasks:

1. Add `Try to Solve` action.
2. Show summary status: no solution, single solution, or multiple solutions.
3. Render all solutions returned within the cap.
4. If there is exactly one solution, render `Soruyu Geliştirmeye Devam Et` and `Soruyu Onayla`.
5. If there are multiple solutions, render only `Soruyu Geliştirmeye Devam Et`.
6. Allow export only after `Soruyu Onayla` is used in the unique-solution case.
7. Warn clearly if the result set was truncated by the configured limit.

Deliverables:

- results panel
- unique-solution approval state wired into export

Exit criteria:

- final approval is impossible when the puzzle has multiple solutions
- export request always identifies a single approved solution page

### Phase 8: PDF renderer

Goal: produce professional two-page PDF output that follows the reference design.

Tasks:

1. Convert the reference image into reusable layout constants.
2. Implement page composition for puzzle page.
3. Implement page composition for selected solution page.
4. Draw 6x6 and 9x9 boards with correct region line thickness.
5. Draw consecutive circles at exact border centers.
6. Place title, variant label, range label, footer text, and date.

Deliverables:

- ReportLab export service
- visual review checklist against `examplesudoku.png`

Exit criteria:

- generated PDF is clean, centered, and consistent across both supported sizes

### Phase 9: Quality hardening

Goal: remove correctness and usability risks before regular use.

Tasks:

1. Add solver regression tests from known puzzle fixtures.
2. Add UI tests for cell entry, edge toggling, and warning states.
3. Add export tests for successful PDF generation.
4. Validate keyboard input rules and focus behavior.
5. Review performance on empty or weakly constrained boards.

Deliverables:

- confidence test suite
- documented known limits for very ambiguous puzzles

Exit criteria:

- core workflows are reproducible and stable on the local machine

### Phase 10: Local delivery workflow

Goal: make the app easy to run repeatedly on the same machine.

Tasks:

1. Build the React frontend for local serving.
2. Configure FastAPI to serve the built frontend assets.
3. Add a simple local start command and documentation.
4. Document where exported PDFs are downloaded from the browser.

Deliverables:

- simple local run mode
- final usage documentation

Exit criteria:

- the application can be started locally without a separate deployment target

## 9. Testing Strategy

Backend tests:

- unit tests for region math, edge rules, validation, and solver branching
- integration tests for `/api/validate`, `/api/solve`, and `/api/export`

Frontend tests:

- component tests for grid rendering and edge toggles
- interaction tests for immediate error highlighting
- workflow tests for solution selection and export requests

Visual verification:

- compare exported PDFs against a checklist derived from `examplesudoku.png`
- verify circle placement, border thickness, footer alignment, and date placement for both sizes

## 10. Main Risks and Mitigations

Risk: consecutive rule modeling can be implemented incorrectly if the absence-of-marker rule is forgotten.

Mitigation: include explicit tests for both marked and unmarked adjacency.

Risk: multiple-solution enumeration can become expensive.

Mitigation: enforce the configurable cap and surface truncation clearly in the UI.

Risk: PDF output can drift from the approved design.

Mitigation: centralize layout constants and validate every change against the reference image.

Risk: frontend and backend validation can disagree.

Mitigation: make backend validation authoritative and keep shared fixtures for both implementations.

## 11. Definition of Done

The project should be considered complete when all of the following are true:

1. The user can create Classic and Consecutive puzzles in 6x6 and 9x9 formats.
2. Invalid row, column, region, and consecutive states are highlighted immediately.
3. The solver can verify solvability and enumerate solutions up to the configured cap.
4. The UI can display all found solutions within that cap and apply the correct decision buttons based on uniqueness.
5. `Soruyu Onayla` is only available when exactly one solution exists.
6. The backend can export a professional two-page PDF matching the approved visual direction.
7. The application runs locally without any database or cloud dependency.