"use client";

import { useParams, useRouter } from "next/navigation";
import { useRestaurant } from "../../context/RestaurantContext";
import { useState } from "react";

export default function TableDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { orders, createOrder, markAsPaid } = useRestaurant();

  const tableId = Number(params.id);
  const [customerCount, setCustomerCount] = useState(1);

  const openOrders = orders.filter(
    (order) => order.tableId === tableId && order.status === "open",
  );

  const paidOrders = orders.filter(
    (order) => order.tableId === tableId && order.status === "paid",
  );

  const isFull = openOrders.length >= 2;

  return (
    <div className="p-10">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-gray-200 rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Table {tableId}</h1>

      {/* Create Order Section */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create Order</h2>

        <input
          type="number"
          min={1}
          value={customerCount}
          onChange={(e) => setCustomerCount(Number(e.target.value))}
          className="border px-3 py-2 rounded mr-4 w-24"
        />

        <button
          onClick={() => createOrder(tableId, customerCount)}
          disabled={isFull}
          className={`px-6 py-2 rounded text-white ${
            isFull ? "bg-gray-400" : "bg-blue-500"
          }`}
        >
          {isFull ? "Table Full" : "Add Order"}
        </button>
      </div>

      {/* Open Orders */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Open Orders ({openOrders.length})
        </h2>

        {openOrders.length === 0 && <p>No open orders</p>}

        {openOrders.map((order) => (
          <div
            key={order.id}
            className="p-4 mb-3 border rounded flex justify-between items-center"
          >
            <div>
              <p>Order ID: {order.id}</p>
              <p>Customers: {order.customerCount}</p>
            </div>

            <button
              onClick={() => markAsPaid(order.id)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Mark as Paid
            </button>
          </div>
        ))}
      </div>

      {/* Paid Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Paid Orders ({paidOrders.length})
        </h2>

        {paidOrders.length === 0 && <p>No paid orders</p>}

        {paidOrders.map((order) => (
          <div
            key={order.id}
            className="p-4 mb-3 border rounded text-black bg-gray-100"
          >
            <p>Order ID: {order.id}</p>
            <p>Customers: {order.customerCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
