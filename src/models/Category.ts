import mongoose, { Schema, models } from "mongoose";

export interface ICategory {
  _id: string;
  name: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default models.Category || mongoose.model<ICategory>("Category", CategorySchema);
