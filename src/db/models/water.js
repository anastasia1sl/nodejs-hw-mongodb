import { model, Schema } from 'mongoose';

const waterSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    value: { type: Number, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

const WaterCollection = model('water', waterSchema);

export default WaterCollection;
