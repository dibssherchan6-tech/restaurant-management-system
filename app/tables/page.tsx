"use client";

import { useRouter } from "next/navigation";
import { useRestaurant } from "../context/RestaurantContext";

type Table = {
  id: number;
  tableNumber: number;
};

const tables: Table[] = [
  { id: 1, tableNumber: 1 },
  { id: 2, tableNumber: 2 },
  { id: 3, tableNumber: 3 },
  { id: 4, tableNumber: 4 },
  { id: 5, tableNumber: 5 },
  { id: 6, tableNumber: 6 },
  { id: 7, tableNumber: 7 },
  { id: 8, tableNumber: 8 },
  { id: 9, tableNumber: 9 },
  { id: 10, tableNumber: 10 },
  { id: 11, tableNumber: 11 },
  { id: 12, tableNumber: 12 },
  { id: 13, tableNumber: 14 },
  { id: 14, tableNumber: 15 },
  { id: 15, tableNumber: 16 },
];

export default function TablePage() {
  const router = useRouter();
  const { orders } = useRestaurant();

  const getTableStatus = (tableId: number) => {
    const openOrders = orders.filter(
      (order) => order.tableId === tableId && order.status === "open",
    );

    if (openOrders.length === 0) return "free";
    if (openOrders.length === 1) return "occupied";
    return "full";
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Table Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tables.map((table) => {
          const status = getTableStatus(table.id);

          return (
            <div
              key={table.id}
              onClick={() => router.push(`/tables/${table.id}`)}
              className={`cursor-pointer p-6 rounded-xl shadow-md text-center font-semibold text-lg transition ${
                status === "free"
                  ? "bg-green-100 text-green-800"
                  : status === "occupied"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              <p>Table {table.tableNumber}</p>
              <p className="mt-2 capitalize">{status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
