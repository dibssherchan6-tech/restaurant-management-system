import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  menuItemId: Number,
  quantity: Number,
  selectedSize: String,
});

const OrderSchema = new mongoose.Schema({
  tableId: Number,
  customerCount: Number,
  status: {
    type: String,
    enum: ["open", "paid"],
    default: "open",
  },
  items: [OrderItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
