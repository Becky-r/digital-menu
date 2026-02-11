"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface TrackedOrder {
  id: string
  orderNumber: string
  items: any[]
  customerName: string
  tableNumber: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  totalAmount: number
  currency: "USD" | "EUR" | "ETB"
  estimatedReadyTime: Date
  actualReadyTime?: Date
  createdAt: Date
  updatedAt: Date
  statusHistory: {
    status: string
    timestamp: Date
    message?: string
  }[]
}

interface OrderTrackingState {
  orders: TrackedOrder[]
  activeOrder: TrackedOrder | null
}

type OrderTrackingAction =
  | { type: "ADD_ORDER"; payload: TrackedOrder }
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: TrackedOrder["status"]; message?: string } }
  | { type: "SET_ACTIVE_ORDER"; payload: TrackedOrder | null }
  | { type: "LOAD_ORDERS"; payload: TrackedOrder[] }

const initialState: OrderTrackingState = {
  orders: [],
  activeOrder: null,
}

function orderTrackingReducer(state: OrderTrackingState, action: OrderTrackingAction): OrderTrackingState {
  switch (action.type) {
    case "ADD_ORDER":
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        activeOrder: action.payload,
      }

    case "UPDATE_ORDER_STATUS":
      const updatedOrders = state.orders.map((order) => {
        if (order.id === action.payload.orderId) {
          const updatedOrder = {
            ...order,
            status: action.payload.status,
            updatedAt: new Date(),
            statusHistory: [
              ...order.statusHistory,
              {
                status: action.payload.status,
                timestamp: new Date(),
                message: action.payload.message,
              },
            ],
          }

          if (action.payload.status === "ready") {
            updatedOrder.actualReadyTime = new Date()
          }

          return updatedOrder
        }
        return order
      })

      return {
        ...state,
        orders: updatedOrders,
        activeOrder:
          state.activeOrder?.id === action.payload.orderId
            ? updatedOrders.find((o) => o.id === action.payload.orderId) || null
            : state.activeOrder,
      }

    case "SET_ACTIVE_ORDER":
      return {
        ...state,
        activeOrder: action.payload,
      }

    case "LOAD_ORDERS":
      return {
        ...state,
        orders: action.payload,
      }

    default:
      return state
  }
}

const OrderTrackingContext = createContext<{
  state: OrderTrackingState
  dispatch: React.Dispatch<OrderTrackingAction>
  createOrder: (orderData: any) => TrackedOrder
  simulateOrderProgress: (orderId: string) => void
} | null>(null)

export function OrderTrackingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(orderTrackingReducer, initialState)

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("digitalMenuTrackedOrders")
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
          estimatedReadyTime: new Date(order.estimatedReadyTime),
          actualReadyTime: order.actualReadyTime ? new Date(order.actualReadyTime) : undefined,
          statusHistory: order.statusHistory.map((h: any) => ({
            ...h,
            timestamp: new Date(h.timestamp),
          })),
        }))
        dispatch({ type: "LOAD_ORDERS", payload: parsedOrders })
      } catch (error) {
        console.error("Failed to load tracked orders:", error)
      }
    }
  }, [])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("digitalMenuTrackedOrders", JSON.stringify(state.orders))
  }, [state.orders])

  const createOrder = (orderData: any): TrackedOrder => {
    const now = new Date()
    const estimatedTime = new Date(now.getTime() + 25 * 60000) // 25 minutes from now

    const newOrder: TrackedOrder = {
      id: `order-${Date.now()}`,
      orderNumber: `#${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
      items: orderData.items,
      customerName: orderData.customerName,
      tableNumber: orderData.tableNumber,
      status: "pending",
      totalAmount: orderData.totalAmount,
      currency: orderData.currency,
      estimatedReadyTime: estimatedTime,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: "pending",
          timestamp: now,
          message: "Order received and being processed",
        },
      ],
    }

    dispatch({ type: "ADD_ORDER", payload: newOrder })
    return newOrder
  }

  const simulateOrderProgress = (orderId: string) => {
    const statusProgression = [
      { status: "confirmed" as const, delay: 2000, message: "Order confirmed by kitchen" },
      { status: "preparing" as const, delay: 8000, message: "Kitchen is preparing your order" },
      { status: "ready" as const, delay: 15000, message: "Your order is ready for pickup!" },
    ]

    statusProgression.forEach(({ status, delay, message }) => {
      setTimeout(() => {
        dispatch({
          type: "UPDATE_ORDER_STATUS",
          payload: { orderId, status, message },
        })

        // Show notification for ready status
        if (status === "ready" && "Notification" in window) {
          new Notification("Order Ready!", {
            body: "Your order is ready for pickup!",
            icon: "/favicon.ico",
          })
        }
      }, delay)
    })
  }

  return (
    <OrderTrackingContext.Provider value={{ state, dispatch, createOrder, simulateOrderProgress }}>
      {children}
    </OrderTrackingContext.Provider>
  )
}

export function useOrderTracking() {
  const context = useContext(OrderTrackingContext)
  if (!context) {
    throw new Error("useOrderTracking must be used within an OrderTrackingProvider")
  }
  return context
}
