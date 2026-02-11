"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, ChefHat, Bell, Truck } from "lucide-react"
import type { TrackedOrder } from "@/lib/order-tracking-context"

interface OrderStatusTimelineProps {
  order: TrackedOrder
}

export function OrderStatusTimeline({ order }: OrderStatusTimelineProps) {
  const statusSteps = [
    {
      key: "pending",
      label: "Order Received",
      icon: Clock,
      description: "Your order has been received",
    },
    {
      key: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      description: "Order confirmed by kitchen",
    },
    {
      key: "preparing",
      label: "Preparing",
      icon: ChefHat,
      description: "Kitchen is preparing your order",
    },
    {
      key: "ready",
      label: "Ready",
      icon: Bell,
      description: "Your order is ready!",
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: Truck,
      description: "Order delivered to your table",
    },
  ]

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex((step) => step.key === status)
  }

  const currentStatusIndex = getStatusIndex(order.status)

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStatusIndex) return "completed"
    if (stepIndex === currentStatusIndex) return "current"
    return "pending"
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {statusSteps.map((step, index) => {
            const Icon = step.icon
            const stepStatus = getStepStatus(index)
            const statusEntry = order.statusHistory.find((h) => h.status === step.key)

            return (
              <div key={step.key} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      stepStatus === "completed"
                        ? "bg-green-500 border-green-500 text-white"
                        : stepStatus === "current"
                          ? "bg-primary border-primary text-primary-foreground animate-pulse"
                          : "bg-muted border-muted-foreground/20 text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 mt-2 ${
                        stepStatus === "completed" ? "bg-green-500" : "bg-muted-foreground/20"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3
                      className={`font-medium ${
                        stepStatus === "completed" || stepStatus === "current"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </h3>
                    {stepStatus === "current" && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                    {stepStatus === "completed" && statusEntry && (
                      <span className="text-xs text-muted-foreground">{formatTime(statusEntry.timestamp)}</span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      stepStatus === "completed" || stepStatus === "current"
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {statusEntry?.message || step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
