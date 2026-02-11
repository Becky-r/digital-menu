"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Minus, Plus, Trash2, CreditCard, Clock } from "lucide-react"
import { useOrder } from "@/lib/order-context"
import { useOrderTracking } from "@/lib/order-tracking-context"
import { CheckoutModal } from "./checkout-modal"
import Image from "next/image"

export function ShoppingCartSheet() {
  const { state, dispatch, getTotalItems, getTotalPrice } = useOrder()
  const { state: trackingState } = useOrderTracking()
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const formatPrice = (price: number) => {
    switch (state.currency) {
      case "EUR":
        return `€${price.toFixed(2)}`
      case "ETB":
        return `${price.toFixed(2)} ETB`
      default:
        return `$${price.toFixed(2)}`
    }
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: itemId })
    } else {
      dispatch({ type: "UPDATE_ITEM", payload: { id: itemId, updates: { quantity: newQuantity } } })
    }
  }

  const removeItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId })
  }

  const handleCheckout = () => {
    setIsOpen(false)
    setIsCheckoutOpen(true)
  }

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const activeOrder = trackingState.activeOrder

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative bg-transparent">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {totalItems}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Your Order</SheetTitle>
            <SheetDescription>
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
              {state.tableNumber && ` • Table ${state.tableNumber}`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {/* Active Order Alert */}
            {activeOrder && activeOrder.status !== "delivered" && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">Active Order: {activeOrder.orderNumber}</p>
                    <p className="text-xs text-blue-600 capitalize">Status: {activeOrder.status}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/orders">Track</a>
                  </Button>
                </div>
              </div>
            )}

            {state.items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">Add items from the menu to get started</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                      {item.image && (
                        <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-sm text-primary font-semibold">{formatPrice(item.price)}</p>

                        {/* Customizations */}
                        {Object.keys(item.customizations).length > 0 && (
                          <div className="mt-1 space-y-1">
                            {Object.entries(item.customizations).map(([type, value]) => (
                              <div key={type} className="text-xs text-muted-foreground">
                                <span className="capitalize">{type}:</span>{" "}
                                {Array.isArray(value) ? value.map((v) => v.name_en).join(", ") : value.name_en}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Special Instructions */}
                        {item.specialInstructions && (
                          <p className="text-xs text-muted-foreground mt-1">Note: {item.specialInstructions}</p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (10%):</span>
                      <span>{formatPrice(totalPrice * 0.1)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-primary">{formatPrice(totalPrice * 1.1)}</span>
                    </div>
                  </div>

                  <Button onClick={handleCheckout} className="w-full bg-primary hover:bg-primary/90" size="lg">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  )
}
