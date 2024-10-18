import { model, Schema } from 'mongoose';

const waterSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    value: { type: Number, required: true },
    dateTime: {
      type: String,
      // default: () => new Date().toLocaleString('en-GB'),
    },
  },
  { timestamps: true, versionKey: false },
);

const WaterCollection = model('water', waterSchema);

export default WaterCollection;
