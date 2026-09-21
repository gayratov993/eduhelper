import { FANLAR, FAN_STYLE } from '../constants'
import { t } from '../i18n'
import { Search } from './icons'

const STATUS = [
  { value: 'all', key: 'filter.all' },
  { value: 'active', key: 'filter.active' },
  { value: 'done', key: 'filter.done' },
]

const SORTS = [
  { value: 'new', key: 'filter.sortNew' },
  { value: 'due', key: 'filter.sortDue' },
  { value: 'name', key: 'filter.sortName' },
  { value: 'fan', key: 'filter.sortFan' },
]

export default function Filters({ status, fan, search, sort, onStatus, onFan, onSearch, onSort }) {
  const chip = (active) =>
    `cursor-pointer rounded-full border px-4 py-2 text-xs font-bold transition ${
      active
        ? 'border-accent/60 bg-accent-soft text-ink'
        : 'border-line bg-surface text-muted hover:border-line-strong hover:text-ink'
    }`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint">
            <Search size={15} />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t('filter.search')}
            className="w-full rounded-xl border border-line bg-surface py-2.5 pr-4 pl-9 text-sm outline-none transition focus:border-accent/60"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          className="cursor-pointer rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-accent/60"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {t(s.key)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold tracking-wider text-faint uppercase">{t('filter.status')}</span>
        {STATUS.map((s) => (
          <button key={s.value} className={chip(status === s.value)} onClick={() => onStatus(s.value)}>
            {t(s.key)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold tracking-wider text-faint uppercase">{t('filter.subject')}</span>
        <button className={chip(fan === 'all')} onClick={() => onFan('all')}>
          {t('filter.allSubjects')}
        </button>
        {FANLAR.map((f) => (
          <button key={f} className={chip(fan === f)} onClick={() => onFan(f)}>
            {FAN_STYLE[f].select}
          </button>
        ))}
      </div>
    </div>
  )
}