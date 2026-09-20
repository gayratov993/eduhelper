import { Schema, model } from 'mongoose'

export const FANLAR = ['Dasturlash', 'Matematika', 'Ingliz tili', 'Fizika', 'Boshqa']

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Vazifa nomi bo\'sh bo\'lishi mumkin emas'],
      trim: true,
      maxlength: [120, 'Vazifa nomi juda uzun (maksimal 120 belgi)'],
    },
    fan: {
      type: String,
      enum: {
        values: FANLAR,
        message: '"{VALUE}" — qo\'llab-quvvatlanmaydigan fan',
      },
      default: 'Boshqa',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    doneAt: {
      type: Date,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Foydalanuvchi talab qilinadi'],
      index: true,
    },
  },
  { timestamps: true },
)

export const Task = model('Task', taskSchema)