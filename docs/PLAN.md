# Sudoku Generator Project Plan / Proje Plani

## TR
### 1. Amaç
Sudoku Generator, yerel calisan, veritabanisiz bir Sudoku uygulamasidir. Klasik ve ardisik Sudoku bulmacalarini ayni editorde uretmeyi, dogrulamayi, cozmeyi ve PDF olarak disari aktarmayi hedefler.

### 2. Kapsam
- 6x6 ve 9x9 Sudoku destegi.
- Gercek zamanli hucre ve kenar dogrulamasi.
- Tek cozum ve coklu cozum akislerinin ayrilmasi.
- Ardışık kurali icin uc durumlu kenar isaretleri.
- Cozumlerde ortak kisimlarin goruntulenmesi.
- TR/EN dil secimi ve belgelerin iki dilli tutulmasi.
- `examplesudoku.png` referansina yaklasan PDF cikti.

### 3. Mimari Kararlar
1. React frontend ve FastAPI backend birlikte kullanilir.
2. Tum islem akisi tek bir puzzle document uzerinden gider.
3. Uygulama stateless calisir; veri tabani yoktur.
4. Client dogrulama hizli geri bildirim verir, backend dogrulama son karar olur.
5. Cozumleme motoru backtracking tabanli ve kural odaklidir.
6. PDF uretimi backend tarafinda ReportLab ile yapilir.
7. Cozum limiti ve mavi daire limiti ayarlanabilirdir.
8. Dil secimi context + localStorage uzerinden yonetilir.

### 4. Uygulama Basamaklari
1. Domain modeli ve schema katmanini sabitle.
2. Editor, hucre girişi ve kenar isaretlerini bitir.
3. Client ve backend dogrulamasini hizala.
4. Cozumleme ve sonuc gezginini tamamla.
5. PDF export ve goruntu referansini ince ayarla.
6. TR/EN i18n, README ve teknik dokumantasyonu bitir.
7. Test, build ve release kontrol listesini calistir.

### 5. Su Anki Klasor Yapisi
- `frontend/src/domain`: puzzle modeli, yardimci fonksiyonlar ve validation mantigi.
- `frontend/src/features/editor`: puzzle ayarlari, grid ve kenar kontrolleri.
- `frontend/src/features/solve`: solve akisi ve sonuc sekmeleri.
- `frontend/src/features/export`: PDF export paneli.
- `frontend/src/features/language`: dil secici.
- `frontend/src/i18n`: copy tablolari, provider ve language helper'lari.
- `backend/app/api/routes`: HTTP route'lari.
- `backend/app/services`: validation, solve ve export servisleri.
- `backend/app/solver`: backtracking ve constraint katmani.
- `backend/app/pdf`: PDF cizim katmani.
- `backend/app/schemas`: request/response modelleri.

### 6. Kabul Kriterleri
- Bir cozum varsa kullanici onay akisi gorebilir.
- Birden fazla cozum varsa sadece gelistirmeye devam akisi acilir.
- Ardisik yorumda bos kenarlar esnek modda test edilir.
- PDF cikti dil secimine gore temel metadata'yi yerel dilde gosterir.
- README, PLAN ve EXP iki dilli olarak korunur.

### 7. Durum Ozeti
- Tamamlandi: editor, validation, solve, PDF export, ortak kisimlar, blue-circle limiti, tri-state kenarlar, TR/EN i18n iskeleti.
- Devam eden: dokumanlarin son hizalamasini ve yeni UI metinlerinin tam kapsanmasini kontrol etmek.

## EN
### 1. Goal
Sudoku Generator is a local, database-free Sudoku application. It aims to build, validate, solve, and export classic and consecutive Sudoku puzzles from the same editor.

### 2. Scope
- Support for 6x6 and 9x9 boards.
- Real-time cell and edge validation.
- Separate flows for single-solution and multi-solution results.
- Tri-state edge markers for consecutive rules.
- Common-parts visualization across solutions.
- TR/EN language switching and bilingual documentation.
- PDF output aligned with the `examplesudoku.png` reference.

### 3. Architecture Decisions
1. Use a React frontend and a FastAPI backend.
2. Drive the app through one shared puzzle document.
3. Keep the app stateless; do not add a database.
4. Let client validation provide instant feedback and backend validation remain authoritative.
5. Build the solver as a backtracking engine with explicit constraint modules.
6. Render PDFs on the backend with ReportLab.
7. Make the solution limit and blue-circle limit configurable.
8. Manage language selection through context and localStorage.

### 4. Delivery Phases
1. Stabilize the domain model and schema layer.
2. Finish the editor, cell entry, and edge markers.
3. Align client and backend validation.
4. Complete solving and the result browser.
5. Polish PDF export and the reference-image layout.
6. Finish TR/EN i18n, README, and technical docs.
7. Run tests, build checks, and release validation.

### 5. Current Folder Layout
- `frontend/src/domain`: puzzle model, helpers, and validation logic.
- `frontend/src/features/editor`: puzzle settings, grid, and edge controls.
- `frontend/src/features/solve`: solve flow and result tabs.
- `frontend/src/features/export`: PDF export panel.
- `frontend/src/features/language`: language switcher.
- `frontend/src/i18n`: copy tables, provider, and language helpers.
- `backend/app/api/routes`: HTTP routes.
- `backend/app/services`: validation, solve, and export services.
- `backend/app/solver`: backtracking and constraint layer.
- `backend/app/pdf`: PDF drawing layer.
- `backend/app/schemas`: request and response models.

### 6. Acceptance Criteria
- The user can approve a puzzle only when a unique solution exists.
- The continue-editing action is shown for both single- and multi-solution outcomes.
- Relaxed consecutive solving tests blank edges as optional.
- The PDF metadata reflects the chosen language.
- README, PLAN, and EXP remain bilingual.

### 7. Status Summary
- Done: editor, validation, solve, PDF export, common parts, blue-circle limit, tri-state edges, and the TR/EN i18n scaffold.
- In progress: final alignment of documentation and complete coverage of visible UI strings.
