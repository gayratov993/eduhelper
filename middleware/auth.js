import jwt from 'jsonwebtoken'

export function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Avval tizimga kiring' })
  }

  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    req.userId = payload.id
    next()
  } catch {
    res.status(401).json({ error: 'Sessiya muddati tugagan. Qayta kiring' })
  }
}