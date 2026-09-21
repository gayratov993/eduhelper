import { useState } from 'react'
import { useSelector } from 'react-redux'
import { isSameDay, startOfDay } from '../utils/date'
import { FAN_STYLE, BADGE_BASE } from '../constants'
import { t, langCode, LOCALES, LANG_MONTHS, LANG_WEEKDAYS } from '../i18n'
import { Calendar, ChevronLeft, ChevronRight, Check } from '../components/icons'

function buildWeeks(cursor) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const year = first.getFullYear()
  const month = first.getMonth()
  const last = new Date(year, month + 1, 0).getDate()
  const offset = (first.getDay() + 6) % 7
  const cells = []
  for (let i = 0; i < offset; i += 1) cells.push(null)
  for (let d = 1; d <= last; d += 1) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

export default function CalendarPage() {
  const items = useSelector((s) => s.tasks.items)
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selected, setSelected] = useState(startOfDay(new Date()))

  const weeks = buildWeeks(cursor)
  const today = startOfDay(new Date())
  const months = LANG_MONTHS[langCode()]
  const weekdays = LANG_WEEKDAYS[langCode()]

  function moveMonth(n) {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + n, 1)
    setCursor(next)
    setSelected(startOfDay(next))
  }

  function jumpToday() {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelected(today)
  }

  function dueOn(day) {
    return items.filter((t) => t.dueDate && isSameDay(t.dueDate, day))
  }

  const selectedTasks = dueOn(selected)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent">
            <Calendar size={22} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">{t('calendar.header')}</h1>
            <p className="mt-0.5 text-sm text-muted">{t('calendar.headerText')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => moveMonth(-1)}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-line bg-card text-muted transition hover:text-ink"
            aria-label={t('calendar.prev')}
          >
            <ChevronLeft size={16} />
          </button>
          <button onClick={jumpToday} className="cursor-pointer rounded-xl border border-line bg-card px-3 py-2 text-sm font-bold text-muted transition hover:text-ink">
            {t('calendar.today')}
          </button>
          <button
            onClick={() => moveMonth(1)}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-line bg-card text-muted transition hover:text-ink"
            aria-label={t('calendar.next')}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-line bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ink">
              {months[cursor.getMonth()]} {cursor.getFullYear()}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-accent" /> {t('calendar.legendToday')}</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> {t('calendar.legendOverdue')}</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> {t('calendar.legendDone')}</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {weekdays.map((w) => (
              <span key={w} className="pb-1 text-[11px] font-bold tracking-wider text-faint uppercase">{w}</span>
            ))}

            {weeks.flat().map((day, i) => {
              if (!day) return <span key={`e${i}`} />
              const tasks = dueOn(day)
              const activeCount = tasks.filter((t) => !t.isDone).length
              const doneCount = tasks.length - activeCount
              const isToday = isSameDay(day, today)
              const isPast = !isToday && day.getTime() < today.getTime() && activeCount > 0
              const isSelected = isSameDay(day, selected)

              return (
                <button
                  key={day.getTime()}
                  onClick={() => setSelected(day)}
                  className={`relative flex h-12 cursor-pointer flex-col items-center justify-center rounded-xl border text-sm font-semibold transition md:h-16 ${
                    isSelected
                      ? 'border-accent bg-accent-soft text-ink'
                      : isToday
                        ? 'border-accent/60 bg-accent/10 text-ink'
                        : 'border-line bg-surface text-muted hover:border-line-strong hover:text-ink'
                  }`}
                >
                  <span>{day.getDate()}</span>
                  {tasks.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex gap-0.5">
                      {activeCount > 0 && (
                        <span className={`h-1.5 w-1.5 rounded-full ${isPast ? 'bg-rose-500' : 'bg-accent'}`} />
                      )}
                      {doneCount > 0 && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-5">
          <h3 className="font-display text-base font-bold text-ink">
            {selected.toLocaleDateString(LOCALES[langCode()], { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          {selectedTasks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-xs text-muted">
              {t('calendar.noTasks')}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {selectedTasks.map((task) => (
                <li key={task._id} className={`rounded-xl border px-3.5 py-2.5 ${task.isDone ? 'border-line bg-surface opacity-70' : 'border-line bg-surface'}`}>
                  <p className={`text-sm font-semibold ${task.isDone ? 'text-muted line-through' : 'text-ink'}`}>{task.title}</p>
                  <span className={`inline-flex items-center gap-1 ${BADGE_BASE} mt-2 ${task.isDone ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/40 dark:text-emerald-300' : FAN_STYLE[task.fan]?.badge || FAN_STYLE.Boshqa.badge}`}>
                    {task.isDone && <Check size={11} />}
                    {task.isDone ? t('calendar.done') : task.fan}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}