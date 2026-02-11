"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

interface OrderItem {
  id: string
  menuItemId: number
  name: string
  price: number
  quantity: number
  customizations: Record<string, any>
  specialInstructions?: string
  image?: string
}

interface OrderState {
  items: OrderItem[]
  tableNumber?: string
  customerName?: string
  customerPhone?: string
  specialInstructions?: string
  currency: "USD" | "EUR" | "ETB"
  language: "en" | "it" | "am"
}

type OrderAction =
  | { type: "ADD_ITEM"; payload: OrderItem }
  | { type: "UPDATE_ITEM"; payload: { id: string; updates: Partial<OrderItem> } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_ORDER" }
  | { type: "SET_TABLE"; payload: string }
  | { type: "SET_CUSTOMER_INFO"; payload: { name?: string; phone?: string } }
  | { type: "SET_SPECIAL_INSTRUCTIONS"; payload: string }
  | { type: "SET_CURRENCY"; payload: "USD" | "EUR" | "ETB" }
  | { type: "SET_LANGUAGE"; payload: "en" | "it" | "am" }

const initialState: OrderState = {
  items: [],
  currency: "USD",
  language: "en",
}

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.menuItemId === action.payload.menuItemId &&
          JSON.stringify(item.customizations) === JSON.stringify(action.payload.customizations),
      )

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        return { ...state, items: updatedItems }
      }

      return { ...state, items: [...state.items, action.payload] }

    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item,
        ),
      }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case "CLEAR_ORDER":
      return { ...initialState, currency: state.currency, language: state.language }

    case "SET_TABLE":
      return { ...state, tableNumber: action.payload }

    case "SET_CUSTOMER_INFO":
      return { ...state, ...action.payload }

    case "SET_SPECIAL_INSTRUCTIONS":
      return { ...state, specialInstructions: action.payload }

    case "SET_CURRENCY":
      return { ...state, currency: action.payload }

    case "SET_LANGUAGE":
      return { ...state, language: action.payload }

    default:
      return state
  }
}

const OrderContext = createContext<{
  state: OrderState
  dispatch: React.Dispatch<OrderAction>
  getTotalItems: () => number
  getTotalPrice: () => number
} | null>(null)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState)

  // Load order from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem("digitalMenuOrder")
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder)
        Object.keys(parsedOrder).forEach((key) => {
          if (key === "items") {
            parsedOrder[key].forEach((item: OrderItem) => {
              dispatch({ type: "ADD_ITEM", payload: item })
            })
          } else if (key === "tableNumber") {
            dispatch({ type: "SET_TABLE", payload: parsedOrder[key] })
          } else if (key === "customerName" || key === "customerPhone") {
            dispatch({
              type: "SET_CUSTOMER_INFO",
              payload: { [key === "customerName" ? "name" : "phone"]: parsedOrder[key] },
            })
          }
        })
      } catch (error) {
        console.error("Failed to load saved order:", error)
      }
    }
  }, [])

  // Save order to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("digitalMenuOrder", JSON.stringify(state))
  }, [state])

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <OrderContext.Provider value={{ state, dispatch, getTotalItems, getTotalPrice }}>{children}</OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider")
  }
  return context
}
