import { FANLAR, FAN_STYLE, BADGE_BASE } from '../constants'
import { t } from '../i18n'

export default function FanStats({ items }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-lg shadow-black/5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-ink">{t('fanstats.title')}</h3>
        <span className="text-xs font-semibold text-faint">{t('fanstats.tasks', { n: items.length })}</span>
      </div>

      <div className="flex flex-col gap-4">
        {FANLAR.map((fan) => {
          const s = items.filter((t) => t.fan === fan)
          const total = s.length
          const done = s.filter((t) => t.isDone).length
          const percent = total ? Math.round((done / total) * 100) : 0

          return (
            <div key={fan} className={total === 0 ? 'opacity-45' : ''}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className={`${BADGE_BASE} ${FAN_STYLE[fan].badge}`}>{FAN_STYLE[fan].select}</span>
                <span className="text-xs font-semibold text-muted">
                  {done}/{total} · {percent}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${FAN_STYLE[fan].bar}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}