"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Users, Receipt, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useOrder } from "@/lib/order-context"
import { useOrderTracking } from "@/lib/order-tracking-context"
import { PaymentMethodSelector } from "./payment-method-selector"
import { SplitBillManager } from "./split-bill-manager"
import { TipCalculator } from "./tip-calculator"
import { createOrderAction } from "@/app/actions/create-order"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { state, dispatch, getTotalPrice } = useOrder()
  const { createOrder, simulateOrderProgress } = useOrderTracking()
  const [activeTab, setActiveTab] = useState("payment")
  const [customerInfo, setCustomerInfo] = useState({
    name: state.customerName || "",
    phone: state.customerPhone || "",
    email: "",
  })
  const [orderType, setOrderType] = useState<"now" | "scheduled">("now")
  const [scheduledTime, setScheduledTime] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState(state.specialInstructions || "")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [tipAmount, setTipAmount] = useState(0)
  const [splitBill, setSplitBill] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.1
  const total = subtotal + tax + tipAmount

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

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
    if (field === "name") {
      dispatch({ type: "SET_CUSTOMER_INFO", payload: { name: value } })
    } else if (field === "phone") {
      dispatch({ type: "SET_CUSTOMER_INFO", payload: { phone: value } })
    }
  }

  const handleProcessPayment = async () => {
    if (!customerInfo.name || !customerInfo.phone || !selectedPaymentMethod) {
      alert("Please fill in all required fields (Name, Phone, Payment Method)")
      return
    }

    setIsProcessing(true)

    try {
      // Create tracked order locally
      const trackedOrder = createOrder({
        items: state.items,
        customerName: customerInfo.name,
        tableNumber: state.tableNumber || "1",
        totalAmount: total,
        currency: state.currency,
        paymentMethod: selectedPaymentMethod,
        tip: tipAmount,
        orderType,
        scheduledTime,
        specialInstructions,
      })

      // Send to database
      const result = await createOrderAction({
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        tableNumber: state.tableNumber || "1",
        totalAmount: total,
        currency: state.currency,
        paymentMethod: selectedPaymentMethod,
        tip: tipAmount,
        orderType,
        scheduledTime,
        specialInstructions,
        items: state.items
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      // Simulate order progress
      simulateOrderProgress(trackedOrder.id)

      // Request notification permission
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission()
      }

      setPaymentComplete(true)
    } catch (error) {
      console.error("Payment failed:", error)
      alert("Failed to process order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNewOrder = () => {
    dispatch({ type: "CLEAR_ORDER" })
    setPaymentComplete(false)
    onClose()
  }

  if (paymentComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h2>
            <p className="text-muted-foreground mb-4">Your payment has been processed successfully</p>
            <div className="bg-muted p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Order Total:</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Estimated Time:</span>
                <span className="font-semibold">25-30 min</span>
              </div>
            </div>
            <div className="space-y-2">
              <Button onClick={handleNewOrder} className="w-full">
                Start New Order
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full bg-transparent" asChild>
                <a href="/orders">Track Order</a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col max-w-4xl max-h-[90vh] overflow-hidden p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Complete your order for Table {state.tableNumber || "N/A"}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-4 border-b bg-muted/10">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="split">
                Split Bill
              </TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="details" className="mt-0 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Name *</Label>
                    <Input
                      id="customer-name"
                      value={customerInfo.name}
                      onChange={(e) => handleCustomerInfoChange("name", e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone">Phone *</Label>
                    <Input
                      id="customer-phone"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange("phone", e.target.value)}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email (Optional)</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Order Timing</Label>
                  <RadioGroup value={orderType} onValueChange={(value: "now" | "scheduled") => setOrderType(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="now" id="order-now" />
                      <Label htmlFor="order-now" className="flex items-center cursor-pointer">
                        <Receipt className="h-4 w-4 mr-2" />
                        Order Now
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="scheduled" id="order-scheduled" />
                      <Label htmlFor="order-scheduled" className="flex items-center cursor-pointer">
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule for Later
                      </Label>
                    </div>
                  </RadioGroup>

                  {orderType === "scheduled" && (
                    <div className="ml-6">
                      <Input
                        type="datetime-local"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="special-instructions">Special Instructions</Label>
                  <Textarea
                    id="special-instructions"
                    value={specialInstructions}
                    onChange={(e) => {
                      setSpecialInstructions(e.target.value)
                      dispatch({ type: "SET_SPECIAL_INSTRUCTIONS", payload: e.target.value })
                    }}
                    placeholder="Any special requests for your order..."
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="mt-0 space-y-6">
              <div className="space-y-4">
                <PaymentMethodSelector
                  selectedMethod={selectedPaymentMethod}
                  onMethodSelect={setSelectedPaymentMethod}
                  currency={state.currency}
                />

                <TipCalculator subtotal={subtotal} currency={state.currency} onTipChange={setTipAmount} />
              </div>
            </TabsContent>

            <TabsContent value="split" className="mt-0 space-y-6">
              {!splitBill ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center h-full">
                  <div className="p-4 bg-muted rounded-full">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">Split the Bill?</h3>
                  <p className="text-muted-foreground max-w-sm">
                    You can split the total amount among multiple people. Would you like to enable bill splitting?
                  </p>
                  <Button onClick={() => setSplitBill(true)} className="mt-2">
                    Enable Bill Splitting
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Bill Splitting Active</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSplitBill(false)}
                      className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      Disable
                    </Button>
                  </div>
                  <SplitBillManager
                    items={state.items}
                    subtotal={subtotal}
                    tax={tax}
                    tip={tipAmount}
                    currency={state.currency}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="review" className="mt-0 space-y-6">
              <div className="space-y-4">
                {/* Order Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <div>Name: {customerInfo.name}</div>
                    <div>Phone: {customerInfo.phone}</div>
                    {customerInfo.email && <div>Email: {customerInfo.email}</div>}
                    <div>Table: {state.tableNumber}</div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Payment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%):</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    {tipAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Tip:</span>
                        <span>{formatPrice(tipAmount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-between items-center p-6 border-t bg-background">
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-primary">{formatPrice(total)}</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {activeTab === "review" ? (
              <Button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="bg-primary hover:bg-primary/90"
              >
                {isProcessing ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Complete Payment
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const tabs = ["details", "payment", "split", "review"]
                  const currentIndex = tabs.indexOf(activeTab)
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1])
                  }
                }}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
