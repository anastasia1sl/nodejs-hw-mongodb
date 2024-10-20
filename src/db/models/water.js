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
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },

  { timestamps: true, versionKey: false },
);

const WaterCollection = model('water', waterSchema);

export default WaterCollection;
