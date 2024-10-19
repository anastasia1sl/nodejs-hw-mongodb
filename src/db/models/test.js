import { model, Schema } from 'mongoose';

const waterSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    dateTime: {
      type: String,
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TestCollection = model('test', waterSchema);
