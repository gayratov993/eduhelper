const KEY = 'token'

export const getToken = () => localStorage.getItem(KEY)
export const setToken = (token) => localStorage.setItem(KEY, token)
export const clearToken = () => localStorage.removeItem(KEY)
export const authHeaders = () => (getToken() ? { Authorization: 'Bearer ' + getToken() } : {})

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
    if (res.status === 401) clearToken()
    const err = new Error(message)
    err.status = res.status
    throw err
  }

  return res.json()
}

export const register = (body) =>
  request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) })

export const login = (body) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) })

export const getMe = () =>
  request('/api/auth/me', { method: 'GET' })