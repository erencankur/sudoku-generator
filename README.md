# Sudoku Generator

## TR
Sudoku Generator, klasik ve ardisik Sudoku bulmacalarini yerel ortamda uretmek, dogrulamak, cozumlemek ve PDF olarak disari aktarmak icin yazilmistir. Arayuz TR/EN destekler, ardisik kenarlar uc durumlu olarak yonetilir, tek cozum ile coklu cozum akisleri ayrilir ve PDF cikti `examplesudoku.png` referansina yaklastirilir.

### Ozellikler
- Klasik ve ardisik Sudoku destegi.
- 6x6 ve 9x9 boyutlari.
- Gercek zamanli hucre ve kenar dogrulamasi.
- Tek cozum varsa onay akisi, birden fazla cozum varsa gelistirmeye devam akisi.
- Esnek cozum aramalarinda mavi daire limiti.
- Ortak kisimlar gorunumu ve PDF export.
- TR/EN dil secimi ve yerel olarak kaydedilen tercih.

### Teknik Notlar
- Frontend: React + Vite + TypeScript.
- Backend: FastAPI + Python 3.13.
- Solver: NumPy destekli backtracking ve kosul ayrimi.
- PDF: ReportLab ile koordinat tabanli cizim.
- Mimari: veritabanisiz, stateless puzzle document akisi.
- Dil altyapisi: `frontend/src/i18n` ve `frontend/src/features/language`.

### Calistirma
Repo kokunden calistirin:

```bash
npm install
npm run install:backend
npm run dev
```

Bu komut frontend'i `5173` portunda, backend'i `8000` portunda calistirir. Sadece frontend build almak icin:

```bash
npm run build
```

Backend testleri:

```bash
npm run test:backend
```

### Dizin Yapisi
- `frontend/src/domain`: puzzle modeli ve dogrulama yardimcilari.
- `frontend/src/features/editor`: puzzle ayarlari, grid ve kenar kontrolleri.
- `frontend/src/features/solve`: cozum akisleri ve sonuc gezgini.
- `frontend/src/features/export`: PDF export aksiyonu.
- `frontend/src/features/language`: dil secici.
- `frontend/src/i18n`: copy tabloları ve provider.
- `backend/app/api`, `backend/app/services`, `backend/app/solver`, `backend/app/pdf`, `backend/app/schemas`: backend katmanlari.

### Belgeler
- [Proje Plani](docs/PLAN.md)
- [Teknik Aciklama](docs/EXP.md)

## EN
Sudoku Generator is a local web app for building, validating, solving, and exporting classic and consecutive Sudoku puzzles. The UI includes TR/EN language switching, tri-state consecutive edges, a unique-vs-multiple solve flow, a common-parts view, and PDF export tuned toward `examplesudoku.png`.

### Features
- Classic and consecutive Sudoku support.
- 6x6 and 9x9 boards.
- Real-time cell and edge validation.
- Approval flow for unique solutions, refinement flow for multiple solutions.
- A configurable blue-circle limit for relaxed solves.
- Common-parts visualization and PDF export.
- TR/EN language selection persisted locally.

### Technical Notes
- Frontend: React + Vite + TypeScript.
- Backend: FastAPI + Python 3.13.
- Solver: NumPy-assisted backtracking with separated constraints.
- PDF: coordinate-driven ReportLab rendering.
- Architecture: stateless, document-based puzzle flow with no database.
- I18n: `frontend/src/i18n` and `frontend/src/features/language`.

### Run Locally
From the repository root:

```bash
npm install
npm run install:backend
npm run dev
```

This starts the frontend on port `5173` and the backend on port `8000`. To build only the frontend:

```bash
npm run build
```

To run backend tests:

```bash
npm run test:backend
```

### Directory Layout
- `frontend/src/domain`: puzzle model and validation helpers.
- `frontend/src/features/editor`: setup controls, grid, and edge controls.
- `frontend/src/features/solve`: solve flow and solution browser.
- `frontend/src/features/export`: PDF export action.
- `frontend/src/features/language`: language switcher.
- `frontend/src/i18n`: copy tables and provider.
- `backend/app/api`, `backend/app/services`, `backend/app/solver`, `backend/app/pdf`, `backend/app/schemas`: backend layers.

### Docs
- [Project Plan](docs/PLAN.md)
- [Technical Explanation](docs/EXP.md)