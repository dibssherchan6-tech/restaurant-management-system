"use client";

import { useParams, useRouter } from "next/navigation";
import { useRestaurant } from "../../context/RestaurantContext";
import { menu } from "../../data/menu";
import { useState } from "react";

export default function TableDetailPage() {
  const params = useParams();
  const router = useRouter();
  const {
    orders,
    createOrder,
    addItemToOrder,
    calculateTotal,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useRestaurant();

  const tableId = Number(params.id);

  const [customerCount, setCustomerCount] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const openOrders = orders.filter(
    (order) => order.tableId === tableId && order.status === "open",
  );

  /* ================= CREATE ORDER ================= */

  const handleCreateOrder = () => {
    createOrder(tableId, customerCount);
  };

  /* ================= GET MENU ITEM ================= */

  const getMenuItem = (menuItemId: number) => {
    for (const category of menu) {
      const item = category.items.find((i) => i.id === menuItemId);
      if (item) return item;
    }
    return null;
  };

  /* ================= SELECT ORDER ================= */

  const selectedOrder = openOrders.find(
    (order) => order.id === selectedOrderId,
  );

  return (
    <div className="p-8">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-gray-200 rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Table {tableId}</h1>

      {/* ================= CREATE ORDER SECTION ================= */}

      <div className="mb-6 border p-4 rounded">
        <input
          type="number"
          min={1}
          value={customerCount}
          onChange={(e) => setCustomerCount(Number(e.target.value))}
          className="border px-2 py-1 mr-3 w-20"
        />

        <button
          onClick={handleCreateOrder}
          disabled={openOrders.length >= 2}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Order
        </button>
      </div>

      {/* ================= OPEN ORDERS ================= */}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Open Orders</h2>

        {openOrders.map((order) => (
          <div
            key={order.id}
            className={`p-3 mb-2 border rounded cursor-pointer  ${
              selectedOrderId === order.id ? "bg-yellow-100 text-black" : ""
            }`}
            onClick={() => setSelectedOrderId(order.id)}
          >
            Order #{order.id} — Customers: {order.customerCount}
          </div>
        ))}
      </div>

      {/* ================= MENU SECTION ================= */}

      {selectedOrder && (
        <>
          <h2 className="text-xl font-semibold mb-4">Menu</h2>

          {menu.map((category) => (
            <div key={category.id} className="mb-6">
              <h3 className="text-lg font-bold mb-2">{category.name}</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {category.items.map((item) => (
                  <div key={item.id} className="border p-3 rounded">
                    <p className="font-semibold">{item.name}</p>

                    {/* NORMAL ITEM */}
                    {item.price && (
                      <>
                        <p>Rs {item.price}</p>
                        <button
                          onClick={() =>
                            addItemToOrder(selectedOrder.id, item.id)
                          }
                          className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Add
                        </button>
                      </>
                    )}

                    {/* HARD DRINK */}
                    {item.sizeOptions && (
                      <>
                        <select
                          className="mt-2 border px-2 py-1 w-full text-black"
                          onChange={(e) => {
                            if (e.target.value) {
                              addItemToOrder(
                                selectedOrder.id,
                                item.id,
                                e.target.value,
                              );
                              e.target.value = "";
                            }
                          }}
                        >
                          <option value="">Select Size</option>
                          {item.sizeOptions.map((option) => (
                            <option key={option.label} value={option.label}>
                              {option.label} - Rs {option.price}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ================= ORDER SUMMARY ================= */}

          <div className="mt-10 border p-4 rounded bg-gray-50 text-black">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {selectedOrder.items.length === 0 && <p>No items added yet</p>}

            {selectedOrder.items.map((item, index) => {
              const menuItem = getMenuItem(item.menuItemId);

              return (
                <div
                  key={index}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>
                    {menuItem?.name}
                    {item.selectedSize && ` (${item.selectedSize})`}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        decreaseQuantity(
                          selectedOrder.id,
                          item.menuItemId,
                          item.selectedSize,
                        )
                      }
                      className="px-2 bg-gray-300 rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          selectedOrder.id,
                          item.menuItemId,
                          item.selectedSize,
                        )
                      }
                      className="px-2 bg-gray-300 rounded"
                    >
                      +
                    </button>

                    <button
                      onClick={() =>
                        removeItem(
                          selectedOrder.id,
                          item.menuItemId,
                          item.selectedSize,
                        )
                      }
                      className="ml-3 text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="mt-4 font-bold text-lg">
              Total: Rs {calculateTotal(selectedOrder)}
            </div>

            <button
              onClick={() => {
                alert("Order sent successfully!");
                router.push("/tables");
              }}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Send Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
