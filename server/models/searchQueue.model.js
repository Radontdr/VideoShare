// models/searchQueue.model.js
import mongoose from "mongoose";

const SearchQueueSchema = new mongoose.Schema(
  {
    query: { type: String, required: true, unique: true },
    count: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("SearchQueue", SearchQueueSchema);
