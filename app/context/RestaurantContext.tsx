"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { menu, MenuItem } from "../data/menu";
import { useEffect } from "react";

/* ================= TYPES ================= */

type OrderItem = {
  menuItemId: number;
  quantity: number;
  selectedSize?: string;
};

type Order = {
  id: string;
  tableId: number;
  customerCount: number;
  status: "open" | "paid";
  items: OrderItem[];
};

type RestaurantContextType = {
  orders: Order[];
  createOrder: (tableId: number, customerCount: number) => void;
  markAsPaid: (orderId: string) => void;

  addItemToOrder: (
    orderId: string,
    menuItemId: number,
    selectedSize?: string,
  ) => void;

  increaseQuantity: (
    orderId: string,
    menuItemId: number,
    selectedSize?: string,
  ) => void;

  decreaseQuantity: (
    orderId: string,
    menuItemId: number,
    selectedSize?: string,
  ) => void;

  removeItem: (
    orderId: string,
    menuItemId: number,
    selectedSize?: string,
  ) => void;

  calculateTotal: (order: Order) => number;
};

/* ================= CONTEXT ================= */

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, []);

  /* ========= CREATE ORDER ========= */

  const createOrder = async (tableId: number, customerCount: number) => {
    const openOrdersForTable = orders.filter(
      (order) => order.tableId === tableId && order.status === "open",
    );

    if (openOrdersForTable.length >= 2) {
      alert("Maximum 2 open orders allowed per table");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableId,
          customerCount,
          status: "open",
          items: [],
        }),
      });

      const data = await res.json();

      setOrders((prev) => [...prev, data]);
    } catch (error) {
      alert("Failed to create order");
    }
  };

  /* ========= MARK AS PAID ========= */

  const markAsPaid = async (orderId: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          updates: { status: "paid" },
        }),
      });

      const updatedOrder = await res.json();

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order)),
      );
    } catch (error) {
      alert("Failed to update order");
    }
  };

  /* ========= ADD ITEM ========= */

  const addItemToOrder = (
    orderId: number,
    menuItemId: number,
    selectedSize?: string,
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const existingItem = order.items.find(
          (item) =>
            item.menuItemId === menuItemId &&
            item.selectedSize === selectedSize,
        );

        if (existingItem) {
          return {
            ...order,
            items: order.items.map((item) =>
              item.menuItemId === menuItemId &&
              item.selectedSize === selectedSize
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          };
        }

        return {
          ...order,
          items: [...order.items, { menuItemId, quantity: 1, selectedSize }],
        };
      }),
    );
  };

  const increaseQuantity = (
    orderId: number,
    menuItemId: number,
    selectedSize?: string,
  ) => {
    addItemToOrder(orderId, menuItemId, selectedSize);
  };

  const decreaseQuantity = (
    orderId: number,
    menuItemId: number,
    selectedSize?: string,
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        return {
          ...order,
          items: order.items
            .map((item) => {
              if (
                item.menuItemId === menuItemId &&
                item.selectedSize === selectedSize
              ) {
                return { ...item, quantity: item.quantity - 1 };
              }
              return item;
            })
            .filter((item) => item.quantity > 0),
        };
      }),
    );
  };

  const removeItem = (
    orderId: number,
    menuItemId: number,
    selectedSize?: string,
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        return {
          ...order,
          items: order.items.filter(
            (item) =>
              !(
                item.menuItemId === menuItemId &&
                item.selectedSize === selectedSize
              ),
          ),
        };
      }),
    );
  };

  /* ========= CALCULATE TOTAL ========= */

  const calculateTotal = (order: Order): number => {
    return order.items.reduce((total, item) => {
      let foundItem: MenuItem | undefined;

      for (const category of menu) {
        const match = category.items.find(
          (menuItem) => menuItem.id === item.menuItemId,
        );
        if (match) {
          foundItem = match;
          break;
        }
      }

      if (!foundItem) return total;

      // If normal item
      if (foundItem.price) {
        return total + foundItem.price * item.quantity;
      }

      // If hard drink with size
      if (foundItem.sizeOptions && item.selectedSize) {
        const size = foundItem.sizeOptions.find(
          (s) => s.label === item.selectedSize,
        );
        if (size) {
          return total + size.price * item.quantity;
        }
      }

      return total;
    }, 0);
  };

  return (
    <RestaurantContext.Provider
      value={{
        orders,
        createOrder,
        markAsPaid,
        addItemToOrder,
        calculateTotal,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}
