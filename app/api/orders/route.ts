import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

/* ================= GET ORDERS ================= */

export async function GET() {
  await connectDB();

  const orders = await Order.find();

  const formatted = orders.map((order) => ({
    ...order.toObject(),
    id: order._id.toString(), // ✅ important
  }));

  return NextResponse.json(formatted);
}

/* ================= CREATE ORDER ================= */

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const order = await Order.create(body);

    const formatted = {
      ...order.toObject(),
      id: order._id.toString(), // ✅ important
    };

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const { orderId, updates } = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, {
      new: true,
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const formatted = {
      ...updatedOrder.toObject(),
      id: updatedOrder._id.toString(),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
