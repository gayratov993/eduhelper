import { t, langCode, LOCALES } from '../i18n'

export function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export function isSameDay(a, b) {
  if (!a || !b) return false
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

export function fmtDate(d) {
  return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
}

export function fmtDateLong(d) {
  return new Date(d).toLocaleDateString(LOCALES[langCode()], { day: 'numeric', month: 'long' })
}

export function fmtDayShort(d) {
  return new Date(d).toLocaleDateString(LOCALES[langCode()], { weekday: 'short' })
}

export function todayLabel() {
  return new Date().toLocaleDateString(LOCALES[langCode()], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function dueMeta(task) {
  if (!task.dueDate) return { text: t('due.none'), tone: 'muted' }
  const diff = Math.round((startOfDay(new Date(task.dueDate)) - startOfDay(new Date())) / 86400000)

  if (task.isDone) return { text: fmtDate(new Date(task.dueDate)), tone: 'done' }
  if (diff < 0)
    return { text: t('due.overdue', { date: fmtDate(new Date(task.dueDate)) }), tone: 'overdue' }
  if (diff === 0) return { text: t('due.today'), tone: 'today' }
  if (diff === 1) return { text: t('due.tomorrow'), tone: 'soon' }
  return { text: fmtDate(new Date(task.dueDate)), tone: 'future' }
}

export function isOverdue(task) {
  if (!task.dueDate || task.isDone) return false
  return startOfDay(new Date(task.dueDate)).getTime() < startOfDay(new Date()).getTime()
}

export function perFan(items) {
  const map = new Map()
  for (const t of items) {
    const cur = map.get(t.fan) || { total: 0, done: 0 }
    cur.total += 1
    if (t.isDone) cur.done += 1
    map.set(t.fan, cur)
  }
  return map
}

export function donePerDay(items, days) {
  const out = []
  const today = startOfDay(new Date())
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = addDays(today, -i)
    const count = items.filter((t) => t.doneAt && isSameDay(t.doneAt, day)).length
    out.push({ day, count })
  }
  return out
}

export function weekDoneCount(items) {
  const weekStart = addDays(startOfDay(new Date()), -6)
  return items.filter((t) => t.doneAt && startOfDay(t.doneAt) >= weekStart).length
}

export function dominantFan(items) {
  const best = { fan: null, count: 0 }
  for (const [fan, s] of perFan(items)) {
    if (s.done > best.count) {
      best.fan = fan
      best.count = s.done
    }
  }
  return best
}