"use client";

import { useRestaurant } from "../context/RestaurantContext";
import { menu } from "../data/menu";

export default function AdminPage() {
  const { orders, markAsPaid, calculateTotal } = useRestaurant();

  const openOrders = orders.filter((order) => order.status === "open");

  const getMenuItem = (menuItemId: number) => {
    for (const category of menu) {
      const item = category.items.find((i) => i.id === menuItemId);
      if (item) return item;
    }
    return null;
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {openOrders.length === 0 && <p>No active orders</p>}

      {openOrders.map((order) => (
        <div key={order.id} className="border p-5 mb-6 rounded">
          <h2 className="text-xl font-semibold">
            Table {order.tableId} — Order #{order.id}
          </h2>

          <div className="mt-3">
            {order.items.map((item, index) => (
              <p key={index}>
                {(() => {
                  const menuItem = getMenuItem(item.menuItemId);
                  return (
                    <>
                      {menuItem?.name}
                      {item.selectedSize && ` (${item.selectedSize})`} x{" "}
                      {item.quantity}
                    </>
                  );
                })()}
                {item.selectedSize && ` (${item.selectedSize})`} x{" "}
                {item.quantity}
              </p>
            ))}
          </div>

          <p className="mt-4 font-bold">Total: Rs {calculateTotal(order)}</p>

          <button
            onClick={() => markAsPaid(order.id)}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
          >
            Confirm Payment
          </button>
        </div>
      ))}
    </div>
  );
}
