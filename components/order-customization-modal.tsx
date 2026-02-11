"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { useOrder } from "@/lib/order-context"

interface MenuItem {
  id: number
  name_en: string
  name_it: string
  name_am: string
  description_en: string
  description_it: string
  description_am: string
  price_usd: number
  price_eur: number
  price_etb: number
  image_url: string
  preparation_time: number
  calories: number
}

interface CustomizationOption {
  id: number
  option_type: string
  name_en: string
  name_it: string
  name_am: string
  price_modifier: number
  is_required: boolean
}

interface OrderCustomizationModalProps {
  isOpen: boolean
  onClose: () => void
  item: MenuItem | null
  customizationOptions?: CustomizationOption[]
}

export function OrderCustomizationModal({
  isOpen,
  onClose,
  item,
  customizationOptions = [],
}: OrderCustomizationModalProps) {
  const { state, dispatch } = useOrder()
  const [quantity, setQuantity] = useState(1)
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, any>>({})
  const [specialInstructions, setSpecialInstructions] = useState("")

  if (!item) return null

  const getName = () => {
    switch (state.language) {
      case "it":
        return item.name_it || item.name_en
      case "am":
        return item.name_am || item.name_en
      default:
        return item.name_en
    }
  }

  const getPrice = () => {
    let basePrice = item.price_usd
    switch (state.currency) {
      case "EUR":
        basePrice = item.price_eur || item.price_usd
        break
      case "ETB":
        basePrice = item.price_etb || item.price_usd * 50
        break
    }

    // Add customization price modifiers
    const customizationPrice = Object.values(selectedCustomizations).reduce((total, customization) => {
      if (Array.isArray(customization)) {
        return total + customization.reduce((sum, c) => sum + (c.price_modifier || 0), 0)
      }
      return total + (customization?.price_modifier || 0)
    }, 0)

    return basePrice + customizationPrice
  }

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

  const handleCustomizationChange = (optionType: string, value: any, isMultiple = false) => {
    setSelectedCustomizations((prev) => {
      if (isMultiple) {
        const currentValues = prev[optionType] || []
        const exists = currentValues.find((v: any) => v.id === value.id)
        if (exists) {
          return {
            ...prev,
            [optionType]: currentValues.filter((v: any) => v.id !== value.id),
          }
        } else {
          return {
            ...prev,
            [optionType]: [...currentValues, value],
          }
        }
      } else {
        return { ...prev, [optionType]: value }
      }
    })
  }

  const handleAddToOrder = () => {
    const orderItem = {
      id: `${item.id}-${Date.now()}-${Math.random()}`,
      menuItemId: item.id,
      name: getName(),
      price: getPrice(),
      quantity,
      customizations: selectedCustomizations,
      specialInstructions: specialInstructions || undefined,
      image: item.image_url,
    }

    dispatch({ type: "ADD_ITEM", payload: orderItem })
    onClose()

    // Reset form
    setQuantity(1)
    setSelectedCustomizations({})
    setSpecialInstructions("")
  }

  const groupedOptions = customizationOptions.reduce(
    (acc, option) => {
      if (!acc[option.option_type]) {
        acc[option.option_type] = []
      }
      acc[option.option_type].push(option)
      return acc
    },
    {} as Record<string, CustomizationOption[]>,
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{getName()}</DialogTitle>
          <DialogDescription>Customize your order</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quantity Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quantity</Label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Customization Options */}
          {Object.entries(groupedOptions).map(([optionType, options]) => {
            const isRequired = options.some((opt) => opt.is_required)
            const isMultiple = optionType === "topping" || optionType === "side"

            return (
              <div key={optionType} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium capitalize">{optionType.replace("_", " ")}</Label>
                  {isRequired && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>

                {isMultiple ? (
                  <div className="space-y-2">
                    {options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`option-${option.id}`}
                          checked={selectedCustomizations[optionType]?.some((v: any) => v.id === option.id) || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleCustomizationChange(optionType, option, true)
                            } else {
                              handleCustomizationChange(
                                optionType,
                                selectedCustomizations[optionType]?.filter((v: any) => v.id !== option.id) || [],
                                false,
                              )
                            }
                          }}
                        />
                        <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <span>{option.name_en}</span>
                            {option.price_modifier > 0 && (
                              <span className="text-sm text-muted-foreground">
                                +{formatPrice(option.price_modifier)}
                              </span>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedCustomizations[optionType]?.id?.toString() || ""}
                    onValueChange={(value) => {
                      const option = options.find((opt) => opt.id.toString() === value)
                      if (option) {
                        handleCustomizationChange(optionType, option)
                      }
                    }}
                  >
                    {options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id.toString()} id={`radio-${option.id}`} />
                        <Label htmlFor={`radio-${option.id}`} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <span>{option.name_en}</span>
                            {option.price_modifier > 0 && (
                              <span className="text-sm text-muted-foreground">
                                +{formatPrice(option.price_modifier)}
                              </span>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            )
          })}

          {/* Special Instructions */}
          <div className="space-y-2">
            <Label htmlFor="special-instructions" className="text-sm font-medium">
              Special Instructions
            </Label>
            <Textarea
              id="special-instructions"
              placeholder="Any special requests? (e.g., no onions, extra spicy)"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
            />
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span className="text-primary">{formatPrice(getPrice() * quantity)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddToOrder} className="bg-primary hover:bg-primary/90">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
