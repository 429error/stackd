import mongoose, { Schema, models } from "mongoose";

export interface IItem {
  _id: string;
  name: string;
  status: "pending" | "done";
  link?: string;
  category: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "done"], default: "pending" },
    link: { type: String, trim: true, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default models.Item || mongoose.model<IItem>("Item", ItemSchema);
