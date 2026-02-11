"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, Banknote, Wallet, Shield } from "lucide-react"

interface PaymentMethodSelectorProps {
  selectedMethod: string
  onMethodSelect: (method: string) => void
  currency: "USD" | "EUR" | "ETB"
}

export function PaymentMethodSelector({ selectedMethod, onMethodSelect, currency }: PaymentMethodSelectorProps) {
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [saveCard, setSaveCard] = useState(false)

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard, American Express",
      icon: CreditCard,
      available: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay with your PayPal account",
      icon: Wallet,
      available: true,
    },
    {
      id: "telebirr",
      name: "Telebirr",
      description: "Ethiopian mobile payment",
      icon: Smartphone,
      available: currency === "ETB",
    },
    {
      id: "cash",
      name: "Pay on Delivery",
      description: "Pay when your order arrives",
      icon: Banknote,
      available: true,
    },
  ]

  const availableMethods = paymentMethods.filter((method) => method.available)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Shield className="h-5 w-5 text-green-500" />
        <span className="text-sm text-muted-foreground">Your payment information is secure and encrypted</span>
      </div>

      <RadioGroup value={selectedMethod} onValueChange={onMethodSelect}>
        <div className="grid gap-3">
          {availableMethods.map((method) => {
            const Icon = method.icon
            return (
              <Card
                key={method.id}
                className={`cursor-pointer transition-all ${selectedMethod === method.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => onMethodSelect(method.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Icon className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <CardTitle className="text-sm">{method.name}</CardTitle>
                      <CardDescription className="text-xs">{method.description}</CardDescription>
                    </div>
                    {method.id === "telebirr" && (
                      <Badge variant="secondary" className="text-xs">
                        Local
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                {selectedMethod === method.id && method.id === "card" && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails((prev) => ({ ...prev, number: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-expiry">Expiry Date</Label>
                          <Input
                            id="card-expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-cvv">CVV</Label>
                          <Input
                            id="card-cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails((prev) => ({ ...prev, cvv: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="save-card"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="save-card" className="text-sm cursor-pointer">
                          Save card for future orders
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                )}

                {selectedMethod === method.id && method.id === "telebirr" && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="telebirr-phone">Phone Number</Label>
                        <Input id="telebirr-phone" placeholder="+251 9XX XXX XXX" type="tel" />
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          You will receive a push notification on your Telebirr app to complete the payment.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}

                {selectedMethod === method.id && method.id === "paypal" && (
                  <CardContent className="pt-0">
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        You will be redirected to PayPal to complete your payment securely.
                      </p>
                    </div>
                  </CardContent>
                )}

                {selectedMethod === method.id && method.id === "cash" && (
                  <CardContent className="pt-0">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">
                        Pay with cash when your order is delivered to your table. Exact change is appreciated.
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </RadioGroup>
    </div>
  )
}
