import { model, Schema } from 'mongoose';

const VodaSchema = new Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'users' },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export const VodaCollection = model('WaterCollection', VodaSchema);
