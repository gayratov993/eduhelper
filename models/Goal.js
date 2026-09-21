import { Schema, model } from 'mongoose'

export const PERIODS = ['week', 'month', 'all']

const goalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Foydalanuvchi talab qilinadi'],
      index: true,
    },
    target: {
      type: Number,
      required: [true, 'Maqsad soni talab qilinadi'],
      min: [1, 'Maqsad kamida 1 ta bo\'lishi kerak'],
      max: [1000, 'Maqsad juda katta (maksimal 1000)'],
    },
    period: {
      type: String,
      enum: {
        values: PERIODS,
        message: '"{VALUE}" — qo\'llab-quvvatlanmaydigan davr',
      },
      default: 'week',
    },
  },
  { timestamps: true },
)

export const Goal = model('Goal', goalSchema)