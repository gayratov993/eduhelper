import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTask } from '../store/tasksSlice'
import { FANLAR, FAN_STYLE } from '../constants'
import { t } from '../i18n'

export default function AddTaskForm() {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [fan, setFan] = useState('Dasturlash')
  const [dueDate, setDueDate] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await dispatch(
        addTask({ title: title.trim(), fan, dueDate: dueDate || undefined }),
      ).unwrap()
      if (title.trim()) {
        setTitle('')
        setDueDate('')
      }
    } catch {
      /* xato xabari Redux notice'da */
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-card p-4 shadow-lg shadow-black/5 sm:p-5"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={120}
        placeholder={t('task.addPlaceholder')}
        className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder-faint outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/25"
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <select
          value={fan}
          onChange={(e) => setFan(e.target.value)}
          className="flex-1 cursor-pointer rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/60"
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
          className="flex-1 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/60"
        />

        <button
          type="submit"
          disabled={busy}
          className="cursor-pointer rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? t('task.adding') : t('task.add')}
        </button>
      </div>
    </form>
  )
}