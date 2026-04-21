import type { Language } from './language';

export interface StatusState {
  key:
    | 'initial'
    | 'puzzleUpdated'
    | 'noSolution'
    | 'strictNoSolutionRelaxedPossible'
    | 'bothResultSetsReady'
    | 'strictUnique'
    | 'strictMultiple'
    | 'strictSolutionSelected'
    | 'relaxedSolutionSelected'
    | 'continueEditing'
    | 'approved'
    | 'exportReady';
  limit?: number;
  index?: number;
}

export interface ValidationMessages {
  rowDuplicate: (value: number) => string;
  columnDuplicate: (value: number) => string;
  regionDuplicate: (value: number) => string;
  consecutiveViolation: string;
  nonConsecutiveViolation: string;
}

export interface UIStrings {
  languageSwitcher: {
    label: string;
    tr: string;
    en: string;
  };
  app: {
    referenceEyebrow: string;
    referenceTitle: string;
    referenceCopy: string;
    heroEyebrow: string;
    heroTitle: string;
    heroCopy: string;
    classicMode: string;
    consecutiveMode: string;
    editorEyebrow: string;
    editorTitle: string;
  };
  puzzleSetup: {
    nameLabel: string;
    namePlaceholder: string;
    dateLabel: string;
    variantLabel: string;
    classicVariant: string;
    consecutiveVariant: string;
    gridSizeLabel: string;
    solutionLimitLabel: string;
    maxBlueCirclesLabel: string;
  };
  solvePanel: {
    eyebrow: string;
    title: string;
    issueLabel: string;
    validatingLabel: string;
    readyLabel: string;
    solveButton: string;
    solvingButton: string;
    continueButton: string;
    approveButton: string;
    resultLabels: {
      strict: string;
      relaxed: string;
    };
    summary: {
      noResult: string;
      noSolution: string;
      unique: string;
      truncated: (count: number) => string;
      multiple: (count: number) => string;
    };
  };
  exportPanel: {
    eyebrow: string;
    title: string;
    descriptionPrefix: string;
    descriptionSuffix: string;
    button: string;
    loading: string;
  };
  solutionTabs: {
    strictEyebrow: string;
    strictTitle: string;
    relaxedEyebrow: string;
    relaxedTitle: string;
    strictDescription: string;
    relaxedDescription: (limit: number) => string;
    strictEmpty: string;
    relaxedEmpty: string;
    commonEyebrow: string;
    commonTitle: string;
    commonCaptionUnique: string;
    commonCaptionTruncated: string;
    commonCaptionMany: string;
    solutionTab: (index: number) => string;
  };
  editorLegend: {
    legendLabel: string;
    required: string;
    forbidden: string;
    empty: string;
    horizontalAria: string;
    verticalAria: string;
  };
  status: {
    initial: string;
    puzzleUpdated: string;
    noSolution: string;
    strictNoSolutionRelaxedPossible: (limit: number) => string;
    bothResultSetsReady: (limit: number) => string;
    strictUnique: string;
    strictMultiple: string;
    strictSolutionSelected: (index: number) => string;
    relaxedSolutionSelected: (index: number) => string;
    continueEditing: string;
    approved: string;
    exportReady: string;
  };
  errors: {
    serverValidationFailed: string;
    solveRequestFailed: string;
    pdfExportFailed: string;
  };
}

const TR_COPY: UIStrings = {
  languageSwitcher: {
    label: 'Dil',
    tr: 'TR',
    en: 'EN',
  },
  app: {
    referenceEyebrow: 'Referans Goruntu',
    referenceTitle: 'PDF Tasarim Yonelimi',
    referenceCopy:
      'Uretilen puzzle ve cozum sayfalari, asagidaki gorseldeki kagit duzeni, ince cizgi dili ve merkezlenmis kompozisyonu referans alir.',
    heroEyebrow: 'Local Sudoku Generator',
    heroTitle: 'Kural Kur, Coz, Onayla, PDF Al',
    heroCopy:
      'Klasik ve ardısik sudoku bulmacalari icin ayni editor kullanilir. Solve sonucu tek cozum verirse iki karar butonu, birden fazla cozum verirse yalnizca gelistirme butonu acilir.',
    classicMode: 'Klasik mod',
    consecutiveMode: 'Ardisik mod',
    editorEyebrow: 'Editor',
    editorTitle: 'Grid ve Kenar Isaretleri',
  },
  puzzleSetup: {
    nameLabel: 'Bulmaca adi',
    namePlaceholder: 'Bulmaca basligi',
    dateLabel: 'Olusturma tarihi',
    variantLabel: 'Variant secimi',
    classicVariant: 'Classic',
    consecutiveVariant: 'Consecutive',
    gridSizeLabel: 'Grid boyutu',
    solutionLimitLabel: 'Cozum limiti',
    maxBlueCirclesLabel: 'Maks. ek mavi daire',
  },
  solvePanel: {
    eyebrow: 'Solve Karari',
    title: 'Cozum Sonrasi Akis',
    issueLabel: 'issue',
    validatingLabel: 'Dogrulaniyor',
    readyLabel: 'Hazir',
    solveButton: 'Cozum Yap',
    solvingButton: 'Cozuluyor...',
    continueButton: 'Soruyu Gelistirmeye Devam Et',
    approveButton: 'Soruyu Onayla',
    resultLabels: {
      strict: 'Kesin',
      relaxed: 'Mavi daireli',
    },
    summary: {
      noResult: 'Cozum sonucu henuz olusturulmadi.',
      noSolution: 'Cozum yok.',
      unique: 'Tek cozum bulundu.',
      truncated: (count: number) => `En az ${count} cozum bulundu ve limit doldu.`,
      multiple: (count: number) => `${count} farkli cozum bulundu.`,
    },
  },
  exportPanel: {
    eyebrow: 'Final Adim',
    title: 'Onayli Puzzle PDF',
    descriptionPrefix: '',
    descriptionSuffix:
      ' icin puzzle ve cozum sayfalari, examplesudoku.png referansina gore iki sayfali PDF olarak uretilir.',
    button: 'PDF Olustur',
    loading: 'PDF Hazirlaniyor...',
  },
  solutionTabs: {
    strictEyebrow: '1. Bolum',
    strictTitle: 'Mevcut Tabloya Gore Cozumler',
    relaxedEyebrow: '2. Bolum',
    relaxedTitle: 'Mavi Daireleri Kabul Eden Cozumler',
    strictDescription: 'Bu bolum, bos biraktiginiz daireleri daire yok olarak kabul eder.',
    relaxedDescription: (limit: number) =>
      `Bu bolum, bos biraktiginiz daireler icin hem daire yok hem daire var durumlarini dener. En fazla ${limit} yeni mavi daireye izin verilir.`,
    strictEmpty: 'Bu kesin yorum altinda cozum bulunamadi.',
    relaxedEmpty: 'Bu esnek yorum altinda secilen mavi daire limitiyle cozum bulunamadi.',
    commonEyebrow: 'Ortak Kisimlar',
    commonTitle: 'Cozumler arasinda sabit kalan hucreler',
    commonCaptionUnique: 'Tek cozum bulundugu icin tum hucreler ortaktir.',
    commonCaptionTruncated:
      'Bu bolum, bulunan cozumler arasinda ortak kalan hucreleri gosterir. Limit nedeniyle sadece bulunan cozumler uzerinden hesaplanir.',
    commonCaptionMany:
      'Bu bolum, bulunan tum cozumler arasinda degismeyen hucreleri gosterir.',
    solutionTab: (index: number) => `Cozum ${index}`,
  },
  editorLegend: {
    legendLabel: 'Ardisik isaret aciklamasi',
    required: 'Mavi daire koy',
    forbidden: 'Kesinlikle koyma',
    empty: 'Bos birak',
    horizontalAria: 'Yatay ardisik isareti',
    verticalAria: 'Dikey ardisik isareti',
  },
  status: {
    initial: 'Bulmacayi hazirlayin. Cozumden sonra karar butonlari otomatik olarak duruma gore gorunecek.',
    puzzleUpdated: 'Bulmaca guncellendi. Cozum sonucunu yenilemek icin tekrar Cozum Yap kullanin.',
    noSolution:
      'Bu girdi ile gecerli bir cozum bulunamadi. Mavi daire limiti cok dusukse esnek yorum da bos kalabilir.',
    strictNoSolutionRelaxedPossible: (limit: number) =>
      `Kesin yorumda cozum yok. Mavi daireli yorum icin en fazla ${limit} yeni daireye izin verildi. Iki bolumu de asagida inceleyebilirsiniz.`,
    bothResultSetsReady: (limit: number) =>
      `Kesin yorum ve mavi daireli yorum icin cozumler hazir. En fazla ${limit} yeni mavi daireye izin verildi.`,
    strictUnique: 'Tek cozum bulundu. Isterseniz Soruyu Gelistirmeye Devam Et ile geri donebilir ya da Soruyu Onayla ile export akisini acabilirsiniz.',
    strictMultiple:
      'Birden fazla cozum bulundu. Tek buton olarak Soruyu Gelistirmeye Devam Et gorunur; bulmacayi daha belirgin hale getirmeniz gerekir.',
    strictSolutionSelected: (index: number) => `Kesin yorumda Cozum ${index} goruntuleniyor.`,
    relaxedSolutionSelected: (index: number) => `Esnek yorumda Cozum ${index} goruntuleniyor.`,
    continueEditing: 'Editor moduna geri donuldu. Grid uzerinde sayi veya ardısik isaretleri ekleyerek bulmacayi gelistirebilirsiniz.',
    approved: 'Bulmaca onaylandi. PDF export artik kullanilabilir.',
    exportReady: 'PDF indirilmeye hazirlandi. Tasarim examplesudoku.png referansina gore uretildi.',
  },
  errors: {
    serverValidationFailed: 'Sunucu dogrulamasi basarisiz.',
    solveRequestFailed: 'Cozum istegi basarisiz.',
    pdfExportFailed: 'PDF export basarisiz.',
  },
};

const EN_COPY: UIStrings = {
  languageSwitcher: {
    label: 'Language',
    tr: 'TR',
    en: 'EN',
  },
  app: {
    referenceEyebrow: 'Reference Image',
    referenceTitle: 'PDF Design Direction',
    referenceCopy:
      'The generated puzzle and solution pages follow the paper layout, thin line language, and centered composition shown in the reference image below.',
    heroEyebrow: 'Local Sudoku Generator',
    heroTitle: 'Set Rules, Solve, Approve, Export PDF',
    heroCopy:
      'The same editor is used for classic and consecutive Sudoku puzzles. If solve returns a single solution, two decision buttons appear; if it returns multiple solutions, only the editing continuation button appears.',
    classicMode: 'Classic mode',
    consecutiveMode: 'Consecutive mode',
    editorEyebrow: 'Editor',
    editorTitle: 'Grid and Edge Markers',
  },
  puzzleSetup: {
    nameLabel: 'Puzzle name',
    namePlaceholder: 'Puzzle title',
    dateLabel: 'Created date',
    variantLabel: 'Variant',
    classicVariant: 'Classic',
    consecutiveVariant: 'Consecutive',
    gridSizeLabel: 'Grid size',
    solutionLimitLabel: 'Solution limit',
    maxBlueCirclesLabel: 'Max extra blue circles',
  },
  solvePanel: {
    eyebrow: 'Solve Decision',
    title: 'Post-Solve Flow',
    issueLabel: 'issue',
    validatingLabel: 'Validating',
    readyLabel: 'Ready',
    solveButton: 'Solve',
    solvingButton: 'Solving...',
    continueButton: 'Continue Editing',
    approveButton: 'Approve Puzzle',
    resultLabels: {
      strict: 'Strict',
      relaxed: 'Relaxed',
    },
    summary: {
      noResult: 'No solve result has been generated yet.',
      noSolution: 'No solution found.',
      unique: 'A unique solution was found.',
      truncated: (count: number) => `At least ${count} solutions were found and the limit was reached.`,
      multiple: (count: number) => `${count} different solutions were found.`,
    },
  },
  exportPanel: {
    eyebrow: 'Final Step',
    title: 'Approved Puzzle PDF',
    descriptionPrefix: 'The puzzle and solution pages for ',
    descriptionSuffix:
      ' are generated as a two-page PDF using examplesudoku.png as the visual reference.',
    button: 'Generate PDF',
    loading: 'Preparing PDF...',
  },
  solutionTabs: {
    strictEyebrow: 'Part 1',
    strictTitle: 'Solutions for the Current Table',
    relaxedEyebrow: 'Part 2',
    relaxedTitle: 'Solutions Accepting Blue Circles',
    strictDescription: 'This section treats the circles you left blank as no-circle markers.',
    relaxedDescription: (limit: number) =>
      `This section tests both no-circle and circle-present interpretations for blank markers. Up to ${limit} new blue circles are allowed.`,
    strictEmpty: 'No solution was found under the strict interpretation.',
    relaxedEmpty: 'No solution was found under the relaxed interpretation with the selected blue-circle limit.',
    commonEyebrow: 'Common Parts',
    commonTitle: 'Cells that stay the same across solutions',
    commonCaptionUnique: 'All cells are common because only one solution exists.',
    commonCaptionTruncated:
      'This section shows cells that remain identical across the found solutions. Because of the limit, it is calculated only from the solutions that were found.',
    commonCaptionMany:
      'This section shows the cells that do not change across all found solutions.',
    solutionTab: (index: number) => `Solution ${index}`,
  },
  editorLegend: {
    legendLabel: 'Consecutive marker legend',
    required: 'Place a blue circle',
    forbidden: 'Never place it',
    empty: 'Leave blank',
    horizontalAria: 'Horizontal consecutive marker',
    verticalAria: 'Vertical consecutive marker',
  },
  status: {
    initial: 'Prepare the puzzle. After solving, the decision buttons appear automatically based on the result.',
    puzzleUpdated: 'Puzzle updated. Run Solve again to refresh the result.',
    noSolution:
      'No valid solution was found for this input. If the blue-circle limit is too low, the relaxed interpretation may also stay empty.',
    strictNoSolutionRelaxedPossible: (limit: number) =>
      `No solution exists under the strict interpretation. Up to ${limit} new blue circles are allowed in the relaxed interpretation. Both sections are shown below.`,
    bothResultSetsReady: (limit: number) =>
      `Solutions are ready for both the strict and relaxed interpretations. Up to ${limit} new blue circles are allowed.`,
    strictUnique: 'A unique solution was found. You can continue editing or approve the puzzle for export.',
    strictMultiple:
      'Multiple solutions were found. Only the continue-editing button is shown; the puzzle needs more constraints.',
    strictSolutionSelected: (index: number) => `Solution ${index} is being shown under the strict interpretation.`,
    relaxedSolutionSelected: (index: number) => `Solution ${index} is being shown under the relaxed interpretation.`,
    continueEditing: 'Returned to editor mode. Add numbers or consecutive markers to refine the puzzle.',
    approved: 'Puzzle approved. PDF export is now available.',
    exportReady: 'The PDF is ready to download. The layout was produced from the examplesudoku.png reference.',
  },
  errors: {
    serverValidationFailed: 'Server validation failed.',
    solveRequestFailed: 'Solve request failed.',
    pdfExportFailed: 'PDF export failed.',
  },
};

export const UI_COPY: Record<Language, UIStrings> = {
  tr: TR_COPY,
  en: EN_COPY,
};

export function getCopy(language: Language): UIStrings {
  return UI_COPY[language];
}

export function getValidationMessages(language: Language): ValidationMessages {
  if (language === 'en') {
    return {
      rowDuplicate: (value) => `${value} appears more than once in the same row.`,
      columnDuplicate: (value) => `${value} appears more than once in the same column.`,
      regionDuplicate: (value) => `${value} appears more than once in the same region.`,
      consecutiveViolation: 'Marked adjacent cells must be consecutive.',
      nonConsecutiveViolation: 'Blank or forbidden adjacent cells cannot be consecutive.',
    };
  }

  return {
    rowDuplicate: (value) => `${value} ayni satirda tekrar ediyor.`,
    columnDuplicate: (value) => `${value} ayni sutunda tekrar ediyor.`,
    regionDuplicate: (value) => `${value} ayni bolgede tekrar ediyor.`,
    consecutiveViolation: 'Isaretli komsu hucreler ardisik olmali.',
    nonConsecutiveViolation: 'Bos veya yasaklanan komsu hucreler ardisik olamaz.',
  };
}

export function formatStatusMessage(language: Language, state: StatusState): string {
  const copy = UI_COPY[language].status;

  switch (state.key) {
    case 'initial':
      return copy.initial;
    case 'puzzleUpdated':
      return copy.puzzleUpdated;
    case 'noSolution':
      return copy.noSolution;
    case 'strictNoSolutionRelaxedPossible':
      return copy.strictNoSolutionRelaxedPossible(state.limit ?? 0);
    case 'bothResultSetsReady':
      return copy.bothResultSetsReady(state.limit ?? 0);
    case 'strictUnique':
      return copy.strictUnique;
    case 'strictMultiple':
      return copy.strictMultiple;
    case 'strictSolutionSelected':
      return copy.strictSolutionSelected(state.index ?? 0);
    case 'relaxedSolutionSelected':
      return copy.relaxedSolutionSelected(state.index ?? 0);
    case 'continueEditing':
      return copy.continueEditing;
    case 'approved':
      return copy.approved;
    case 'exportReady':
      return copy.exportReady;
    default:
      return copy.initial;
  }
}
