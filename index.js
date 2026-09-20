import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Task } from './models/Task.js'
import { User } from './models/User.js'
import { signToken, authRequired } from './middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(express.json())

function sendError(res, error) {
  if (error.name === 'ValidationError') {
    const problems = Object.values(error.errors).map((e) => e.message)
    return res.status(400).json({ error: 'Ma\'lumotlar noto\'g\'ri kiritildi', problems })
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Identifikator noto\'g\'ri' })
  }
  if (error.code === 11000) {
    return res.status(409).json({ error: 'Bu foydalanuvchi nomi allaqachon band' })
  }
  console.error(error)
  return res.status(500).json({ error: 'Serverda kutilmagan xatolik yuz berdi' })
}

/* ───────────── Auth ───────────── */

app.post('/api/auth/register', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ token: signToken(user._id), user: { id: user._id, username: user.username } })
  } catch (error) {
    sendError(res, error)
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body ?? {}
    if (!username || !password) {
      return res.status(400).json({ error: 'Foydalanuvchi nomi va parolni kiriting' })
    }

    const user = await User.findOne({ username: String(username).trim().toLowerCase() }).select('+password')
    if (!user || !(await user.comparePassword(String(password)))) {
      return res.status(401).json({ error: 'Foydalanuvchi nomi yoki parol noto\'g\'ri' })
    }

    res.json({ token: signToken(user._id), user: { id: user._id, username: user.username } })
  } catch (error) {
    sendError(res, error)
  }
})

app.get('/api/auth/me', authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(401).json({ error: 'Foydalanuvchi topilmadi' })
    res.json({ id: user._id, username: user.username })
  } catch (error) {
    sendError(res, error)
  }
})

/* ───────────── Tasks (faqat kirdan so'ng) ───────────── */

app.get('/api/tasks', authRequired, async (_req, res) => {
  try {
    const tasks = await Task.find({ user: _req.userId }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    sendError(res, error)
  }
})

app.post('/api/tasks', authRequired, async (req, res) => {
  try {
    const body = { title: req.body.title, fan: req.body.fan, dueDate: req.body.dueDate }
    const task = await Task.create({ ...body, user: req.userId })
    res.status(201).json(task)
  } catch (error) {
    sendError(res, error)
  }
})

async function ownTaskOr404(req, res) {
  const task = await Task.findOne({ _id: req.params.id, user: req.userId })
  if (!task) {
    res.status(404).json({ error: 'Bunday vazifa topilmadi' })
    return null
  }
  return task
}

app.patch('/api/tasks/:id', authRequired, async (req, res) => {
  try {
    const owned = await ownTaskOr404(req, res)
    if (!owned) return

    const ALLOWED = ['title', 'fan', 'dueDate', 'isDone']
    const update = {}
    for (const key of ALLOWED) {
      if (req.body[key] !== undefined) update[key] = req.body[key]
    }
    if (update.isDone !== undefined) {
      update.doneAt = update.isDone ? (owned.doneAt || new Date()) : null
    }

    const task = await Task.findByIdAndUpdate(owned._id, update, {
      new: true,
      runValidators: true,
    })
    res.json(task)
  } catch (error) {
    sendError(res, error)
  }
})

app.delete('/api/tasks/:id', authRequired, async (req, res) => {
  try {
    const owned = await ownTaskOr404(req, res)
    if (!owned) return
    await Task.findByIdAndDelete(owned._id)
    res.status(200).json({ ok: true })
  } catch (error) {
    sendError(res, error)
  }
})

/* ───────────── Frontend (build) ───────────── */

const clientDist = path.join(__dirname, 'client', 'dist')
if (fs.existsSync(clientDist)) {
  app.use((req, res, next) => {
    if (req.path === '/' || req.path === '/index.html') {
      res.setHeader('Cache-Control', 'no-store')
    }
    next()
  })
  app.use(express.static(clientDist))
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next()
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API yo\'li topilmadi' })
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

/* ───────────── Ishga tushirish ───────────── */

try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  console.log('✅ MongoDB ulandi. Baza:', mongoose.connection.name)
} catch (error) {
  console.log('❌ MongoDB ga ulanishda xatolik:', error.message)
  process.exit(1)
}

const PORT = process.env.PORT || 3000
app.listen(PORT, (error) => {
  if (error) {
    console.log('❌ Port band. Eski serverni to\'xtating yoki PORT o\'zgartiring')
    process.exit(1)
  }
  console.log(`✨ EduHelper → http://localhost:${PORT}`)
})