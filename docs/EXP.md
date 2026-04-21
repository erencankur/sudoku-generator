# Sudoku Generator Technical Explanation / Teknik Aciklama

## TR
### 1. Sistem Ozeti
Sudoku Generator, tek bir puzzle document uzerinden calisan yerel bir uygulamadir. Kullanici arayuzde puzle'yi duzenler, frontend anlik dogrulama yapar, backend kesin dogrulamayi ve cozumlemeyi calistirir, son olarak PDF export backend tarafinda uretilir.

### 2. Puzzle Document Sozlesmesi
Uygulamanin temel veri modeli su alanlara dayanir:

```json
{
  "name": "My Puzzle",
  "created_at": "2026-04-21",
  "variant": "classic",
  "size": 9,
  "region_shape": { "rows": 3, "cols": 3 },
  "grid": [[null, null, null]],
  "consecutive_edges": {
    "horizontal": [[0, 1, 0, -1, 0, 0, 0, 0]],
    "vertical": [[0, 0, 0, 0, 0, 0, 0, 0]]
  }
}
```

- `grid` bos hucreler icin `null` kullanir.
- `consecutive_edges.horizontal` boyutu `size x (size - 1)` olur.
- `consecutive_edges.vertical` boyutu `(size - 1) x size` olur.
- Kenar degerleri `-1`, `0`, `1` seklindedir.
- `1` mavi daire gerekli, `-1` kesinlikle yasak, `0` bos anlamina gelir.

### 3. Frontend Akisi
Frontend tarafinda ana baglanti noktasi `frontend/src/App.tsx` dosyasidir.

- `frontend/src/i18n` dil secimini, copy tablolarini ve provider'i tutar.
- `frontend/src/features/language/LanguageSwitcher.tsx` TR/EN secimini gösterir.
- `frontend/src/features/editor` kullanici girdilerini ve kenar isaretlerini yonetir.
- `frontend/src/features/solve` cozum sonucunu, durum mesajini ve ortak kisimlar gorunumunu sunar.
- `frontend/src/features/export` onayli puzzle icin PDF butonunu gosterir.

Validation iki katmanda calisir:

1. `validatePuzzleDocument(puzzle, language)` frontend'de anlik sorunlari bulur.
2. `validatePuzzle(...)` backend'den gelen son dogrulama sonucunu ekler.

Kullanici bir degisiklik yaptiginda puzzle signature degisir ve app yeniden dogrulama, onay sifirlama ve cozum sonucunu temizleme isini yapar.

### 4. Cozumleme Akisi
Backend cozumleme `backend/app/services/solve_service.py` icinde toplanir.

- Once strict validation calisir.
- Sonra strict enumerate islemi yapilir.
- Consecutive puzzle ise relaxed validation ve relaxed enumerate da calisir.
- Relaxed sonuclar, `max_added_blue_circles` limiti ile filtrelenir.
- Sonuc `SolveResponse` icinde strict ve relaxed set olarak dondurulur.

Bu ayrim UI icin onemlidir:

- Tek cozum varsa onay butonu gorunur.
- Birden fazla cozum varsa yalnizca gelistirmeye devam akisi gorunur.
- Relaxed akis varsa iki ayri sekme gosterilir.

### 5. PDF Export Akisi
PDF export `backend/app/services/export_service.py` uzerinden calisir.

- Kullanici onayli cozum secince request backend'e gider.
- Backend onayli cozumun puzzle kurallarini sagladigini dogrular.
- `draw_puzzle_page` ve `draw_solution_page` ile iki sayfa uretilir.
- `draw_metadata` baslik, alt bilgi, footer ve board etiketlerini cizer.
- Consecutive circler `draw_consecutive_edges` ile cizilir.

Export request'i aktif dili de tasir, boylece PDF metadata dil secimine uyum saglar.

### 6. Localization Mimarisi
Dil altyapisi `frontend/src/i18n` altinda bulunur.

- `I18nProvider` secili dili saklar.
- Dil secimi localStorage uzerine yazilir.
- UI copy tabloları TR ve EN icin ayri tutulur.
- Validation ve status mesajlari dil bazli uretilir.

Bu yaklasim, bileşenlere tek tek string gecmek yerine ortak bir copy kaynagi kullanmayi saglar.

### 7. Test ve Guvenilirlik Notlari
- React build, TypeScript derlemesi ve FastAPI testleri ayridir.
- Backtracking solver, dogrulama kurallarindan bagimsiz olarak test edilebilir.
- PDF cizimi, solver sonucundan ayrildigi icin goruntu degisiklikleri daha kolay kontrol edilir.
- Stateles yapida hata ayiklama daha basittir cunku tum puzzle durumu request icinde tasinir.

## EN
### 1. System Overview
Sudoku Generator is a local application that operates on a single puzzle document. The user edits the puzzle in the browser, the frontend performs instant validation, the backend performs authoritative validation and solving, and PDF export is generated on the backend.

### 2. Puzzle Document Contract
The core data model is based on the following fields:

```json
{
  "name": "My Puzzle",
  "created_at": "2026-04-21",
  "variant": "classic",
  "size": 9,
  "region_shape": { "rows": 3, "cols": 3 },
  "grid": [[null, null, null]],
  "consecutive_edges": {
    "horizontal": [[0, 1, 0, -1, 0, 0, 0, 0]],
    "vertical": [[0, 0, 0, 0, 0, 0, 0, 0]]
  }
}
```

- `grid` uses `null` for empty cells.
- `consecutive_edges.horizontal` has shape `size x (size - 1)`.
- `consecutive_edges.vertical` has shape `(size - 1) x size`.
- Edge values are `-1`, `0`, and `1`.
- `1` means a required blue circle, `-1` means forbidden, and `0` means blank.

### 3. Frontend Flow
The main entry point on the frontend is `frontend/src/App.tsx`.

- `frontend/src/i18n` stores language selection, copy tables, and the provider.
- `frontend/src/features/language/LanguageSwitcher.tsx` exposes the TR/EN toggle.
- `frontend/src/features/editor` handles user input and edge markers.
- `frontend/src/features/solve` renders the solve result, status message, and common-parts view.
- `frontend/src/features/export` exposes the PDF action for an approved puzzle.

Validation runs in two layers:

1. `validatePuzzleDocument(puzzle, language)` finds immediate issues in the frontend.
2. `validatePuzzle(...)` merges the backend validation result.

When the user edits the puzzle, the signature changes and the app resets approval, clears solve results, and refreshes validation state.

### 4. Solving Flow
Backend solving is centralized in `backend/app/services/solve_service.py`.

- Strict validation runs first.
- Then strict enumeration runs.
- For consecutive puzzles, relaxed validation and relaxed enumeration also run.
- Relaxed results are filtered by `max_added_blue_circles`.
- The result returns strict and relaxed sets in `SolveResponse`.

This split matters for the UI:

- A unique solution reveals the approval action.
- Multiple solutions keep only the continue-editing action.
- If relaxed results exist, the app shows two separate solution sections.

### 5. PDF Export Flow
PDF export is handled by `backend/app/services/export_service.py`.

- The approved solution is sent to the backend.
- The backend verifies that the approved solution satisfies the puzzle rules.
- `draw_puzzle_page` and `draw_solution_page` generate the two PDF pages.
- `draw_metadata` renders the title, footer, and board labels.
- Consecutive circles are rendered by `draw_consecutive_edges`.

The export request also carries the active language so the PDF metadata matches the selected UI language.

### 6. Localization Architecture
The language layer lives under `frontend/src/i18n`.

- `I18nProvider` stores the active language.
- The selected language persists in localStorage.
- UI copy tables are kept separately for TR and EN.
- Validation and status messages are generated per language.

This approach keeps the UI consistent without passing strings through every component manually.

### 7. Reliability Notes
- React build, TypeScript compile, and FastAPI tests are validated separately.
- The backtracking solver is testable independently of the UI.
- PDF rendering is isolated from solving, which makes visual tuning easier.
- Stateless design keeps debugging straightforward because the full puzzle state travels in each request.
