import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { isOverdue, isSameDay, startOfDay, perFan, donePerDay, weekDoneCount, dominantFan, fmtDayShort } from '../utils/date'
import { FANLAR, FAN_STYLE } from '../constants'
import { t } from '../i18n'
import { fetchFocusSummary } from '../store/focusSlice'
import { Collection, Check, Leaf, Alert, Chart, Target, Trophy, Sparkles, Timer } from '../components/icons'

export default function Stats() {
  const dispatch = useDispatch()
  const items = useSelector((s) => s.tasks.items)
  const focusSummary = useSelector((s) => s.focus.summary)

  useEffect(() => {
    dispatch(fetchFocusSummary())
  }, [dispatch])

  const stats = useMemo(() => {
    const total = items.length
    const done = items.filter((t) => t.isDone).length
    const pending = total - done
    const overdue = items.filter(isOverdue).length
    const percent = total ? Math.round((done / total) * 100) : 0
    const week = donePerDay(items, 7)
    const maxDay = Math.max(1, ...week.map((d) => d.count))
    const fans = perFan(items)
    const weekDone = weekDoneCount(items)
    const best = dominantFan(items)
    return { total, done, pending, overdue, percent, week, maxDay, fans, weekDone, best }
  }, [items])

  const { total, done, pending, overdue, percent, week, maxDay, fans, weekDone, best } = stats
  const today = startOfDay(new Date())

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent">
          <Chart size={22} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">{t('stats.header')}</h1>
          <p className="mt-0.5 text-sm text-muted">{t('stats.headerText')}</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { Icon: Collection, key: 'dash.total', value: total },
          { Icon: Check, key: 'dash.done', value: done },
          { Icon: Leaf, key: 'stats.pending', value: pending },
          { Icon: Alert, key: 'dash.overdue', value: overdue },
        ].map(({ Icon, key, value }) => (
          <div key={key} className="rounded-2xl border border-line bg-card p-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface text-muted">
              <Icon size={18} />
            </span>
            <p className="mt-2 font-display text-3xl font-extrabold text-ink">{value}</p>
            <p className="text-xs font-semibold text-muted">{t(key)}</p>
          </div>
        ))}
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-3">
        {/* Haftalik grafik */}
        <div className="rounded-2xl border border-line bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-ink">{t('stats.last7')}</h2>
              <p className="mt-0.5 text-xs text-muted">{t('stats.last7Sub')}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">
              <Target size={12} />
              {t('stats.perWeek', { n: weekDone })}
            </span>
          </div>

          <div className="mt-6 flex h-44 items-end gap-2 sm:gap-3">
            {week.map((d) => {
              const isToday = isSameDay(d.day, today)
              const isMax = d.count > 0 && d.count === maxDay
              return (
                <div key={d.day.getTime()} className="group flex flex-1 flex-col items-center gap-2">
                  <span className={`text-xs font-bold ${d.count ? 'text-ink' : 'text-faint'}`}>{d.count > 0 ? d.count : ''}</span>
                  <div
                    className={`w-full rounded-t-xl transition-all ${
                      isToday
                        ? 'bg-accent'
                        : isMax
                          ? 'bg-accent/70'
                          : 'bg-accent/25 group-hover:bg-accent/40'
                    }`}
                    style={{ height: `${(d.count / maxDay) * 100 + 6}%` }}
                  />
                  <span className={`text-[11px] font-semibold capitalize ${isToday ? 'text-accent' : 'text-faint'}`}>
                    {fmtDayShort(d.day)}
                  </span>
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-center text-[11px] text-faint">{t('stats.todayHighlight')}</p>
        </div>

        {/* Fan progress */}
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-base font-bold text-ink">{t('stats.overall')}</h2>

          <div className="rounded-xl border border-line bg-surface p-4 text-center">
            <p className="font-display text-4xl font-extrabold text-accent">{percent}%</p>
            <p className="mt-1 text-xs font-semibold text-muted">{t('stats.completionRate')}</p>
          </div>

          {best.fan && best.count > 0 && (
            <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-xs text-muted">
              <Trophy size={15} className="mt-0.5 shrink-0 text-amber-500" />
              <span>
                {t('stats.topSubject', { fan: FAN_STYLE[best.fan].select, n: best.count })}
              </span>
            </div>
          )}

          <div className="mt-1 flex flex-col gap-4">
            {FANLAR.map((fan) => {
              const s = fans.get(fan)
              const totalFan = s?.total || 0
              const doneFan = s?.done || 0
              const pct = totalFan ? Math.round((doneFan / totalFan) * 100) : 0
              return (
                <div key={fan} className={totalFan === 0 ? 'opacity-40' : ''}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-muted">{FAN_STYLE[fan].select}</span>
                    <span className="font-semibold text-faint">{doneFan}/{totalFan} · {pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface">
                    <div className={`h-full rounded-full ${FAN_STYLE[fan].bar}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Fokus vaqti (fanlar bo'yicha) */}
      <section className="rounded-2xl border border-line bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent-soft text-accent">
                <Timer size={15} />
              </span>
              {t('stats.focusTitle')}
            </h2>
            <p className="mt-1 text-xs text-muted">{t('stats.focusSub')}</p>
          </div>
          {focusSummary?.totalMinutes > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">
              <Timer size={12} />
              {t('stats.focusTotal', { n: focusSummary.totalMinutes })}
            </span>
          )}
        </div>

        {!focusSummary || focusSummary.totalMinutes === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-6 text-center text-xs text-muted">
            {t('stats.focusEmpty')}
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {focusSummary.byFan.map((f) => {
              const style = FAN_STYLE[f.fan] || FAN_STYLE.Boshqa
              const pct = Math.round((f.minutes / focusSummary.byFan[0].minutes) * 100)
              return (
                <div key={f.fan}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-2 font-bold text-muted">
                      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                      {f.fan === 'all' ? t('focus.general') : style.select}
                    </span>
                    <span className="font-semibold text-faint">
                      {f.minutes} min · {f.sessions} {t('focus.sessions')}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface">
                    <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink">
          <Sparkles size={16} className="text-accent" />
          {t('stats.tip')}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {total === 0
            ? t('stats.tipEmpty')
            : percent === 100
              ? t('stats.tipFull')
              : overdue > 0
                ? t('stats.tipOverdue', { n: overdue })
                : t('stats.tipPace', { n: pending })}
        </p>
        <Link to="/focus" className="mt-3 inline-block text-xs font-bold text-accent hover:underline">
          {t('stats.goFocus')}
        </Link>
      </section>
    </div>
  )
}