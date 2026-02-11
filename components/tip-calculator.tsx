"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TipCalculatorProps {
  subtotal: number
  currency: "USD" | "EUR" | "ETB"
  onTipChange: (tip: number) => void
}

export function TipCalculator({ subtotal, currency, onTipChange }: TipCalculatorProps) {
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")

  const tipPercentages = [10, 15, 18, 20, 25]

  const formatPrice = (price: number) => {
    switch (currency) {
      case "EUR":
        return `€${price.toFixed(2)}`
      case "ETB":
        return `${price.toFixed(2)} ETB`
      default:
        return `$${price.toFixed(2)}`
    }
  }

  const calculateTip = (percentage: number) => {
    return (subtotal * percentage) / 100
  }

  const handlePercentageSelect = (percentage: number) => {
    setSelectedPercentage(percentage)
    setCustomAmount("")
    onTipChange(calculateTip(percentage))
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedPercentage(null)
    const amount = Number.parseFloat(value) || 0
    onTipChange(amount)
  }

  useEffect(() => {
    // Default to 15% tip
    if (selectedPercentage === null && !customAmount) {
      handlePercentageSelect(15)
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add Tip</CardTitle>
        <CardDescription>Show your appreciation for great service</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 gap-2">
          {tipPercentages.map((percentage) => (
            <Button
              key={percentage}
              variant={selectedPercentage === percentage ? "default" : "outline"}
              size="sm"
              onClick={() => handlePercentageSelect(percentage)}
              className="flex flex-col h-auto py-2"
            >
              <span className="text-sm font-semibold">{percentage}%</span>
              <span className="text-xs">{formatPrice(calculateTip(percentage))}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-tip">Custom Amount</Label>
          <Input
            id="custom-tip"
            type="number"
            placeholder="0.00"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            step="0.01"
            min="0"
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span>Subtotal:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Tip:</span>
          <span className="text-primary font-semibold">
            {formatPrice(selectedPercentage ? calculateTip(selectedPercentage) : Number.parseFloat(customAmount) || 0)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
