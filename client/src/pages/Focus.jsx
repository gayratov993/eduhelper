import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FANLAR, FAN_STYLE } from '../constants'
import { isOverdue, isSameDay, startOfDay } from '../utils/date'
import { t } from '../i18n'
import { recordFocus } from '../store/focusSlice'
import { Timer, Target, Coffee, Leaf, Play, Pause, Refresh, Alert, Sparkles } from '../components/icons'

const MODES = [
  { key: 'focus', keyLabel: 'focus.header', minutes: 25, Icon: Target },
  { key: 'quick', keyLabel: 'focus.short', minutes: 5, Icon: Coffee },
  { key: 'long', keyLabel: 'focus.long', minutes: 15, Icon: Leaf },
]

const DAY_KEY = () => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `planeri-focus-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function loadDay() {
  try {
    return JSON.parse(localStorage.getItem(DAY_KEY()) || '{"sessions":0,"minutes":0}')
  } catch {
    return { sessions: 0, minutes: 0 }
  }
}

function fmt(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return `${m}:${s}`
}

function beep() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.7)
    osc.onended = () => ctx.close()
  } catch {
    /* ovoz yo'q */
  }
}

export default function Focus() {
  const dispatch = useDispatch()
  const items = useSelector((s) => s.tasks.items)
  const [mode, setMode] = useState('focus')
  const [fan, setFan] = useState('all')
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(MODES[0].minutes * 60)
  const [day, setDay] = useState(loadDay)
  const completedRef = useRef(false)

  const active = MODES.find((m) => m.key === mode)
  const total = active.minutes * 60

  const fractions = (remaining / total)
  const angle = Math.round(fractions * 360)
  const percent = Math.round(fractions * 100)

  function pickMode(key) {
    const m = MODES.find((x) => x.key === key)
    setMode(key)
    setRunning(false)
    setRemaining(m.minutes * 60)
  }

  function reset() {
    setRunning(false)
    setRemaining(active.minutes * 60)
  }

  useEffect(() => {
    if (!running) return
    if (remaining <= 0) {
      if (!completedRef.current) {
        completedRef.current = true
        if (mode === 'focus') {
          const patch = { ...day, sessions: day.sessions + 1, minutes: day.minutes + active.minutes }
          setDay(patch)
          try {
            localStorage.setItem(DAY_KEY(), JSON.stringify(patch))
          } catch {
            /* noop */
          }
          dispatch(recordFocus({ fan, minutes: active.minutes }))
          setTimeout(() => pickMode('quick'), 1200)
        } else {
          reset()
        }
        beep()
      }
      return
    }
    completedRef.current = false
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(id)
  }, [running, remaining, day, mode, active, fan, dispatch]) // eslint-disable-line

  const overdue = useMemo(() => items.filter(isOverdue).length, [items])

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent">
          <Timer size={22} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">{t('focus.header')}</h1>
          <p className="mt-0.5 text-sm text-muted">{t('focus.headerText')}</p>
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* Timer */}
        <section className="flex flex-col items-center rounded-2xl border border-line bg-card p-6 sm:p-8 lg:col-span-2">
          <div className="mb-5 grid w-full grid-cols-3 gap-2 rounded-xl border border-line bg-app p-1">
            {MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => pickMode(m.key)}
                className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-bold transition sm:text-sm ${
                  mode === m.key ? 'bg-accent text-white shadow' : 'text-muted hover:text-ink'
                }`}
              >
                <m.Icon size={15} />
                {t(m.keyLabel)} · {m.minutes}'
              </button>
            ))}
          </div>

          <div
            className="relative grid h-60 w-60 place-items-center rounded-full"
            style={{
              background: `conic-gradient(var(--accent) ${angle}deg, color-mix(in oklab, var(--ink) 10%, transparent) 0deg)`,
            }}
          >
            <div className="absolute inset-3 grid place-items-center rounded-full bg-card">
              <div className="flex flex-col items-center">
                <span className="font-display text-6xl font-extrabold tracking-tight text-ink tabular-nums">
                  {fmt(remaining)}
                </span>
                <span className="mt-1 text-xs font-bold tracking-widest text-faint uppercase">
                  {t(active.keyLabel)} · {percent}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => setRunning((r) => !r)}
              className={`flex cursor-pointer items-center gap-2 rounded-2xl px-8 py-3 text-sm font-extrabold text-white shadow-lg transition hover:brightness-110 ${
                running ? 'bg-rose-500 shadow-rose-500/25' : 'bg-accent shadow-indigo-500/25'
              }`}
            >
              {running ? <Pause size={16} /> : <Play size={16} />}
              {running
                ? t('focus.stop')
                : remaining === total
                  ? t('focus.start')
                  : t('focus.resume')}
            </button>
            <button
              onClick={reset}
              className="flex cursor-pointer items-center gap-1.5 rounded-2xl border border-line bg-surface px-6 py-3 text-sm font-bold text-muted transition hover:text-ink"
            >
              <Refresh size={15} />
              {t('focus.reset')}
            </button>
          </div>

          {/* Fan (sessiya uchun belgi) */}
          <div className="mt-6 w-full max-w-sm">
            <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-faint uppercase">
              {t('focus.subjectLabel')}
            </label>
            <select
              value={fan}
              onChange={(e) => setFan(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition focus:border-accent/60"
            >
              <option value="all">{t('focus.general')}</option>
              {FANLAR.map((f) => (
                <option key={f} value={f}>
                  {FAN_STYLE[f].select}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Bugungi natija */}
        <section className="flex flex-col gap-4">
          <div className="rounded-2xl border border-line bg-card p-5">
            <h2 className="font-display text-base font-bold text-ink">{t('focus.today')}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-line bg-surface p-4 text-center">
                <p className="font-display text-3xl font-extrabold text-accent">{day.minutes}</p>
                <p className="mt-1 text-[11px] font-semibold text-muted">{t('focus.minutes')}</p>
              </div>
              <div className="rounded-xl border border-line bg-surface p-4 text-center">
                <p className="font-display text-3xl font-extrabold text-accent">{day.sessions}</p>
                <p className="mt-1 text-[11px] font-semibold text-muted">{t('focus.sessions')}</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-faint italic">
              {t('focus.note', { n: MODES[0].minutes })}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-card p-5">
            <h2 className="font-display text-base font-bold text-ink">{t('focus.pressure')}</h2>
            <p className="mt-2 text-sm text-muted">
              {overdue > 0 ? (
                <span className="flex items-start gap-2">
                  <Alert size={16} className="mt-0.5 shrink-0 text-rose-500" />
                  {t('focus.pressureOverdue', { n: overdue })}
                </span>
              ) : (
                t('focus.pressureOk')
              )}
            </p>
            <Link to="/" className="mt-3 inline-block text-xs font-bold text-accent hover:underline">
              {t('focus.backHome')}
            </Link>
          </div>

          <p className="flex items-start gap-2 text-[11px] text-faint">
            <Sparkles size={14} className="mt-0.5 shrink-0" />
            <span>{t('focus.why')}</span>
          </p>
        </section>
      </div>
    </div>
  )
}