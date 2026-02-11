"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Phone, Star } from "lucide-react"
import { OrderStatusTimeline } from "./order-status-timeline"
import { useOrderTracking, type TrackedOrder } from "@/lib/order-tracking-context"

interface OrderTrackingModalProps {
  isOpen: boolean
  onClose: () => void
  order: TrackedOrder | null
}

export function OrderTrackingModal({ isOpen, onClose, order }: OrderTrackingModalProps) {
  const { dispatch } = useOrderTracking()
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  useEffect(() => {
    if (!order) return

    const updateTimeRemaining = () => {
      const now = new Date()
      const estimatedTime = order.estimatedReadyTime
      const diff = estimatedTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining("Ready now!")
      } else {
        const minutes = Math.floor(diff / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`)
      }
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [order])

  const formatPrice = (price: number, currency: string) => {
    switch (currency) {
      case "EUR":
        return `€${price.toFixed(2)}`
      case "ETB":
        return `${price.toFixed(2)} ETB`
      default:
        return `$${price.toFixed(2)}`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "preparing":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      case "delivered":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleMarkAsDelivered = () => {
    if (order && order.status === "ready") {
      dispatch({
        type: "UPDATE_ORDER_STATUS",
        payload: {
          orderId: order.id,
          status: "delivered",
          message: "Order delivered to table",
        },
      })
    }
  }

  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Order {order.orderNumber}</DialogTitle>
              <DialogDescription>Track your order status in real-time</DialogDescription>
            </div>
            <Badge className={`${getStatusColor(order.status)} capitalize`}>{order.status}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info Card */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Table {order.tableNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order.customerName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {order.status === "ready" || order.status === "delivered" ? "Ready!" : `Est. ${timeRemaining}`}
                </span>
              </div>
              <div className="text-sm font-semibold">Total: {formatPrice(order.totalAmount, order.currency)}</div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <OrderStatusTimeline order={order} />

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-semibold">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                    {item.specialInstructions && (
                      <p className="text-xs text-muted-foreground mt-1">Note: {item.specialInstructions}</p>
                    )}
                  </div>
                  <span className="font-medium">{formatPrice(item.price * item.quantity, order.currency)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status History */}
          <div className="space-y-3">
            <h3 className="font-semibold">Status History</h3>
            <div className="space-y-2">
              {order.statusHistory
                .slice()
                .reverse()
                .map((entry, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="capitalize font-medium">{entry.status}</span>
                      {entry.message && <span className="text-muted-foreground ml-2">- {entry.message}</span>}
                    </div>
                    <span className="text-muted-foreground">
                      {entry.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex space-x-2">
            {order.status === "ready" && (
              <Button onClick={handleMarkAsDelivered} className="bg-green-600 hover:bg-green-700">
                Mark as Delivered
              </Button>
            )}
            {order.status === "delivered" && (
              <Button variant="outline" className="text-yellow-600 border-yellow-600 bg-transparent">
                <Star className="h-4 w-4 mr-2" />
                Rate Order
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
