import { Schema, model } from 'mongoose'

const focusSessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Foydalanuvchi talab qilinadi'],
      index: true,
    },
    fan: {
      type: String,
      required: [true, 'Fan talab qilinadi'],
      trim: true,
    },
    minutes: {
      type: Number,
      required: [true, 'Daqiqalar soni talab qilinadi'],
      min: [1, 'Sessiya kamida 1 daqiqa bo\'lishi kerak'],
      max: [480, 'Bir sessiya 8 soatdan uzun bo\'la olmaydi'],
    },
    date: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true },
)

export const FocusSession = model('FocusSession', focusSessionSchema)