import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toggleTask, removeTask, editTask } from '../store/tasksSlice'
import { FANLAR, FAN_STYLE, BADGE_BASE } from '../constants'
import { dueMeta } from '../utils/date'
import { t } from '../i18n'
import { Pencil, Trash, Collection } from './icons'

const DUE_TONE = {
  muted: 'text-faint',
  done: 'text-muted',
  overdue: 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  today: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  soon: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  future: 'border-line bg-surface text-muted',
}

const DUE_DOT = {
  muted: 'bg-faint',
  done: 'bg-emerald-500',
  overdue: 'bg-rose-500',
  today: 'bg-amber-500',
  soon: 'bg-sky-500',
  future: 'bg-faint',
}

function TaskEdit({ task, onCancel }) {
  const dispatch = useDispatch()
  const [title, setTitle] = useState(task.title)
  const [fan, setFan] = useState(task.fan)
  const [dueDate, setDueDate] = useState(task.dueDate ? String(task.dueDate).slice(0, 10) : '')
  const [busy, setBusy] = useState(false)

  async function save(e) {
    e.preventDefault()
    if (!title.trim()) return
    setBusy(true)
    try {
      await dispatch(
        editTask({
          id: task._id,
          body: { title: title.trim(), fan, dueDate: dueDate || null },
        }),
      ).unwrap()
      onCancel()
    } catch {
      /* notice Redux'da */
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={save}
      className="flex flex-col gap-2.5 rounded-2xl border border-accent/40 bg-card p-4 ring-2 ring-accent/15"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={120}
        autoFocus
        className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent/60"
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={fan}
          onChange={(e) => setFan(e.target.value)}
          className="flex-1 cursor-pointer rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none"
        >
          {FANLAR.map((f) => (
            <option key={f} value={f}>
              {FAN_STYLE[f].select}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={busy}
          className="cursor-pointer rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {busy ? t('task.saving') : t('task.save')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-xl border border-line bg-surface px-4 py-2 text-xs font-bold text-muted transition hover:text-ink"
        >
          {t('task.cancel')}
        </button>
      </div>
    </form>
  )
}

function TaskItem({ task, editing, onEdit }) {
  const dispatch = useDispatch()
  const due = dueMeta(task)

  if (editing) return <TaskEdit task={task} onCancel={onEdit} />

  return (
    <li
      className={`group flex items-start gap-3 rounded-2xl border p-4 transition sm:items-center ${
        task.isDone
          ? 'border-line bg-card/70'
          : due.tone === 'overdue'
            ? 'border-rose-500/40 bg-rose-500/5'
            : 'border-line bg-card hover:border-line-strong hover:shadow-md'
      }`}
    >
      <label className="mt-0.5 sm:mt-0">
        <input
          type="checkbox"
          checked={task.isDone}
          onChange={(e) => dispatch(toggleTask({ id: task._id, isDone: e.target.checked }))}
          className="h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-faint bg-transparent transition checked:border-accent checked:bg-accent"
          title={task.isDone ? t('task.undoneLabel') : t('task.doneLabel')}
        />
      </label>

      <div className="min-w-0 flex-1">
        <p
          className={`break-words text-sm font-semibold sm:text-base ${
            task.isDone ? 'text-muted line-through' : 'text-ink'
          }`}
        >
          {task.title}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 ${BADGE_BASE} ${FAN_STYLE[task.fan]?.badge || FAN_STYLE.Boshqa.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${FAN_STYLE[task.fan]?.dot || 'bg-faint'}`} />
            {task.fan}
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${DUE_TONE[due.tone] || DUE_TONE.muted}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${DUE_DOT[due.tone] || DUE_DOT.muted}`} />
            {due.text}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {!task.isDone && (
          <button
            onClick={onEdit}
            className="cursor-pointer rounded-lg px-2 py-1 text-faint transition hover:bg-accent-soft hover:text-accent"
            title={t('task.edit')}
            aria-label={t('task.edit')}
          >
            <Pencil size={15} />
          </button>
        )}
        <button
          onClick={() => dispatch(removeTask(task._id))}
          className="cursor-pointer rounded-lg px-2 py-1 text-faint transition hover:bg-rose-500/15 hover:text-rose-400"
          title={t('task.delete')}
          aria-label={t('task.delete')}
        >
          <Trash size={15} />
        </button>
      </div>
    </li>
  )
}

export default function TaskList({ items }) {
  const [editingId, setEditingId] = useState(null)

  if (!items.length) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-line bg-card px-6 py-14 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-surface text-faint">
          <Collection size={30} />
        </span>
        <p className="mt-4 text-sm font-semibold text-ink">{t('task.emptyTitle')}</p>
        <p className="mt-1 max-w-xs text-xs text-muted">{t('task.emptyBody')}</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          editing={editingId === task._id}
          onEdit={() => setEditingId(editingId === task._id ? null : task._id)}
        />
      ))}
    </ul>
  )
}