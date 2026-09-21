import { authHeaders } from './auth'

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(path, {
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...authHeaders(),
      },
      ...options,
    })
  } catch {
    throw new Error('NETWORK')
  }

  if (!res.ok) {
    let message = 'Serverda xatolik yuz berdi'
    try {
      const data = await res.json()
      if (data.problems?.length) message = data.problems.join('\n')
      else if (data.error) message = data.error
    } catch {
      /* JSON emas */
    }
    const err = new Error(message)
    err.status = res.status
    throw err
  }

  return res.json()
}

export const getGoals = () => request('/api/goals')

export const addGoal = (body) =>
  request('/api/goals', { method: 'POST', body: JSON.stringify(body) })

export const deleteGoal = (id) =>
  request('/api/goals/' + id, { method: 'DELETE' })