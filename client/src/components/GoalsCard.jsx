import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGoals, addGoal, removeGoal } from '../store/goalSlice'
import { t } from '../i18n'
import { Target, Trash, Plus } from './icons'

const PERIODS = [
  { value: 'week', key: 'goal.periodWeek' },
  { value: 'month', key: 'goal.periodMonth' },
  { value: 'all', key: 'goal.periodAll' },
]

const PERIOD_AUTO = { week: 'goal.autoWeek', month: 'goal.autoMonth', all: 'goal.autoAll' }

function percentOf(goal) {
  if (!goal.target) return 0
  return Math.min(100, Math.round((goal.done / goal.target) * 100))
}

export default function GoalsCard() {
  const dispatch = useDispatch()
  const goals = useSelector((s) => s.goals.items)
  const items = useSelector((s) => s.tasks.items)
  const [target, setTarget] = useState('')
  const [period, setPeriod] = useState('week')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    dispatch(fetchGoals())
  }, [items, dispatch])

  async function submit(e) {
    e.preventDefault()
    const value = parseInt(target, 10)
    if (!value || value < 1) return
    setBusy(true)
    try {
      await dispatch(addGoal({ target: value, period })).unwrap()
      setTarget('')
    } catch {
      /* notice orqali server xatosi ko'rinadi */
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-lg shadow-black/5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent-soft text-accent">
              <Target size={15} />
            </span>
            {t('goal.title')}
          </h3>
          <p className="mt-1 text-[11px] text-muted">{t('goal.subtitle')}</p>
        </div>
      </div>

      {goals.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-5 text-center text-xs text-muted">
          {t('goal.empty')}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {goals.map((goal) => {
            const pct = percentOf(goal)
            const achieved = goal.done >= goal.target
            return (
              <li key={goal._id} className="rounded-xl border border-line bg-surface p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-ink">{t(PERIOD_AUTO[goal.period])}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold ${
                        achieved ? 'text-emerald-600 dark:text-emerald-300' : 'text-accent'
                      }`}
                    >
                      {achieved ? t('goal.achieved') : t('goal.progress', { done: goal.done, target: goal.target })}
                    </span>
                    <button
                      onClick={() => dispatch(removeGoal(goal._id))}
                      className="cursor-pointer rounded-lg px-1.5 py-1 text-faint transition hover:bg-rose-500/15 hover:text-rose-400"
                      title={t('task.delete')}
                      aria-label={t('task.delete')}
                    >
                      <Trash size={13} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-app">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        achieved ? 'bg-emerald-500' : 'bg-accent'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-muted">{pct}%</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <form onSubmit={submit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max="1000"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder={t('goal.targetPlaceholder')}
            className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink placeholder-faint outline-none transition focus:border-accent/60"
          />
          <button
            type="submit"
            disabled={busy}
            className="flex cursor-pointer items-center gap-1 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            <Plus size={13} />
            {t('goal.create')}
          </button>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="cursor-pointer rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink outline-none transition focus:border-accent/60"
        >
          {PERIODS.map((p) => (
            <option key={p.value} value={p.value}>
              {t(p.key)}
            </option>
          ))}
        </select>
      </form>
    </div>
  )
}