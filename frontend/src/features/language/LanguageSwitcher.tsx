import { useI18n } from '../../i18n';

export default function LanguageSwitcher() {
  const { language, setLanguage, copy } = useI18n();

  return (
    <div className="language-switcher" aria-label={copy.languageSwitcher.label}>
      <span className="language-switcher-label">{copy.languageSwitcher.label}</span>
      <div className="segmented-control language-switcher-control">
        <button
          type="button"
          className={language === 'tr' ? 'segment active' : 'segment'}
          onClick={() => setLanguage('tr')}
        >
          {copy.languageSwitcher.tr}
        </button>
        <button
          type="button"
          className={language === 'en' ? 'segment active' : 'segment'}
          onClick={() => setLanguage('en')}
        >
          {copy.languageSwitcher.en}
        </button>
      </div>
    </div>
  );
}
