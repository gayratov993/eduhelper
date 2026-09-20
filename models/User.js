import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Foydalanuvchi nomi talab qilinadi'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Foydalanuvchi nomi kamida 3 belgi bo\'lishi kerak'],
      maxlength: [20, 'Foydalanuvchi nomi 20 belgidan oshmasligi kerak'],
      match: [/^[a-z0-9_.-]+$/, 'Foydalanuvchi nomida faqat lotin harflari, raqam va _.- ishlatilsin'],
    },
    password: {
      type: String,
      required: [true, 'Parol talab qilinadi'],
      minlength: [6, 'Parol kamida 6 belgi bo\'lishi kerak'],
      select: false,
    },
  },
  { timestamps: true },
)

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

export const User = model('User', userSchema)