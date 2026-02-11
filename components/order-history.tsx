"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Clock, Eye, RotateCcw, Filter } from "lucide-react"
import { useOrderTracking } from "@/lib/order-tracking-context"
import { OrderTrackingModal } from "./order-tracking-modal"
import { useOrder } from "@/lib/order-context"

export function OrderHistory() {
  const { state: trackingState } = useOrderTracking()
  const { dispatch } = useOrder()
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

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

  const handleTrackOrder = (order: any) => {
    setSelectedOrder(order)
    setIsTrackingModalOpen(true)
  }

  const handleReorder = (order: any) => {
    // Clear current order and add items from previous order
    dispatch({ type: "CLEAR_ORDER" })
    order.items.forEach((item: any) => {
      dispatch({ type: "ADD_ITEM", payload: item })
    })
  }

  const filteredOrders = trackingState.orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order History</h2>
          <p className="text-muted-foreground">View and track your previous orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by order number or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground text-center">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't placed any orders yet. Start by browsing our menu!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                    <CardDescription>
                      {order.createdAt.toLocaleDateString()} at{" "}
                      {order.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {" • "}Table {order.tableNumber}
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} capitalize`}>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""} •{" "}
                        {formatPrice(order.totalAmount, order.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      {order.status === "ready" && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 mb-2">Ready for pickup!</Badge>
                      )}
                      {order.estimatedReadyTime && order.status !== "delivered" && (
                        <p className="text-sm text-muted-foreground">
                          Est. ready:{" "}
                          {order.estimatedReadyTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleTrackOrder(order)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Track Order
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleReorder(order)}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reorder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  )
}
