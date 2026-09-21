import { LANGS, useLang, t } from '../i18n'

export default function LangSwitch({ compact = false }) {
  const { lang, setLang } = useLang()

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-surface p-1">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`cursor-pointer rounded-lg px-2 py-1.5 text-xs font-bold transition ${
              lang === l.code ? 'bg-accent text-white shadow' : 'text-muted hover:text-ink'
            }`}
            title={l.label}
          >
            {l.short}
          </button>
        ))}
      </div>
    )
  }

  return (
    <section className="flex items-center justify-between rounded-2xl border border-line bg-card p-5">
      <div>
        <p className="text-sm font-bold text-ink">{t('lang.title')}</p>
        <p className="mt-0.5 text-xs text-muted">{t('lang.subtle')}</p>
      </div>
      <div className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-surface p-1">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              lang === l.code ? 'bg-accent text-white shadow' : 'text-muted hover:text-ink'
            }`}
            title={l.label}
          >
            {l.label}
          </button>
        ))}
      </div>
    </section>
  )
}