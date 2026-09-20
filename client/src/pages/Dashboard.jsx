import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchTasks } from '../store/tasksSlice'
import { isOverdue, isSameDay, startOfDay, todayLabel, dueMeta } from '../utils/date'
import AddTaskForm from '../components/AddTaskForm'
import Notice from '../components/Notice'
import Progress from '../components/Progress'
import FanStats from '../components/FanStats'
import Filters from '../components/Filters'
import TaskList from '../components/TaskList'
import { Collection, Check, Clock, Alert, Timer, Refresh } from '../components/icons'

function StatCard({ icon, label, value, hint, tone }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface text-muted">
          {icon}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tone}`}>{hint}</span>
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold text-ink">{value}</p>
      <p className="mt-0.5 text-xs font-semibold text-muted">{label}</p>
    </div>
  )
}

function greet() {
  const h = new Date().getHours()
  if (h < 5) return 'Xayrli tun'
  if (h < 12) return 'Xayrli tong'
  if (h < 18) return 'Xayrli kun'
  return 'Xayrli kech'
}

function Upcoming({ items }) {
  const list = useMemo(
    () =>
      items
        .filter((t) => !t.isDone && t.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 4),
    [items],
  )

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-5 shadow-lg shadow-black/5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-ink">Keyingi muddatlar</h3>
        <Link to="/calendar" className="text-xs font-bold text-accent hover:underline">
          Kalendar →
        </Link>
      </div>
      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-xs text-muted">
          Muddati bor vazifalar yo'q — bo'sh vaqt.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {list.map((t) => {
            const due = dueMeta(t)
            return (
              <li key={t._id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5">
                <p className="min-w-0 truncate text-sm font-semibold text-ink">{t.title}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    due.tone === 'overdue'
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300'
                      : due.tone === 'today'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        : 'bg-accent-soft text-accent'
                  }`}
                >
                  {due.text}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function Dashboard() {
  const dispatch = useDispatch()
  const { items, loading, notice, offline } = useSelector((s) => s.tasks)
  const user = useSelector((s) => s.auth.user)
  const [status, setStatus] = useState('all')
  const [fan, setFan] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('due')

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  const visible = useMemo(() => {
    let list = items
    const needle = search.trim().toLowerCase()
    if (needle) list = list.filter((t) => t.title.toLowerCase().includes(needle))
    if (status === 'active') list = list.filter((t) => !t.isDone)
    if (status === 'done') list = list.filter((t) => t.isDone)
    if (fan !== 'all') list = list.filter((t) => t.fan === fan)

    const sorted = [...list]
    if (sort === 'due') {
      sorted.sort((a, b) => {
        if (a.isDone !== b.isDone) return a.isDone ? 1 : -1
        const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
        const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
        return da - db
      })
    } else if (sort === 'name') {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'uz'))
    } else if (sort === 'fan') {
      sorted.sort((a, b) => a.fan.localeCompare(b.fan))
    } else {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return sorted
  }, [items, status, fan, search, sort])

  const done = items.filter((t) => t.isDone).length
  const overdue = items.filter(isOverdue).length
  const pending = items.length - done
  const active = items.filter((t) => !t.isDone)
  const doneToday = items.filter((t) => t.doneAt && isSameDay(t.doneAt, startOfDay(new Date()))).length

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-card p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="mb-2 inline-flex rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-bold tracking-widest text-accent uppercase">
              Challendj №1 · Rejalashtiruvchi
            </p>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {greet()}, @{user?.username}
            </h1>
            <p className="mt-1.5 text-sm text-muted sm:text-base">
              Bugungi rejangizni ko'ring — muddatlar ustidan nazorat, fokus esa keyingi sahifada.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold capitalize text-ink">
              {todayLabel()}
            </span>
            <button
              onClick={() => dispatch(fetchTasks())}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-xs font-bold text-muted transition hover:text-ink"
            >
              <Refresh size={13} />
              Yangilash
            </button>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Collection size={18} />} label="Jami vazifa" value={items.length} hint="jami" tone="bg-accent-soft text-accent" />
        <StatCard icon={<Check size={18} />} label="Bajarilgan" value={done} hint={`${pending} qoldi`} tone="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" />
        <StatCard icon={<Clock size={18} />} label="Bugun bajarildi" value={doneToday} hint="bugun" tone="bg-sky-500/15 text-sky-600 dark:text-sky-300" />
        <StatCard icon={<Alert size={18} />} label="Muddati o'tgan" value={overdue} hint={overdue ? 'zudlik bilan' : 'hozircha yo\'q'} tone={overdue ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300' : 'bg-surface text-faint'} />
      </section>

      {/* Fokus CTA */}
      {active.length > 0 && (
        <Link
          to="/focus"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-accent/40 bg-gradient-to-r from-accent-soft to-transparent px-5 py-4 transition hover:border-accent"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white shadow-lg shadow-indigo-500/30">
              <Timer size={18} />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-ink">Fokus vaqti</p>
              <p className="mt-0.5 text-xs text-muted">
                {active.length} ta faol vazifa bor. Pomodoro rejimini yoqib, ishni boshlang.
              </p>
            </div>
          </div>
          <span className="text-faint transition group-hover:translate-x-1 group-hover:text-accent">→</span>
        </Link>
      )}

      {/* Main grid */}
      <section className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <AddTaskForm />
          <Notice notice={notice} offline={offline} />

          <div className="rounded-2xl border border-line bg-card p-4 shadow-lg shadow-black/5 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-ink">Vazifalar</h2>
              <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-muted">
                {visible.length} / {items.length}
              </span>
            </div>
            <Filters
              status={status}
              fan={fan}
              search={search}
              sort={sort}
              onStatus={setStatus}
              onFan={setFan}
              onSearch={setSearch}
              onSort={setSort}
            />
            <div className="mt-4">
              {loading && items.length === 0 ? (
                <div className="flex flex-col gap-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-2xl border border-line bg-surface" />
                  ))}
                </div>
              ) : (
                <TaskList items={visible} />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Progress done={done} total={items.length} />
          <FanStats items={items} />
          <Upcoming items={items} />
        </div>
      </section>

      <footer className="pb-2 text-center text-xs text-faint">
        EduHelper · React + Redux Toolkit + Tailwind · Node.js + Express + MongoDB
      </footer>
    </div>
  )
}