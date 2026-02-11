"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Plus, Star } from "lucide-react"
import { DietaryBadges } from "./dietary-badges"
import { AllergenInfo } from "./allergen-info"
import Image from "next/image"

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
  is_available: boolean
  is_featured: boolean
  preparation_time: number
  calories: number
  is_vegetarian: boolean
  is_vegan: boolean
  is_gluten_free: boolean
  is_halal: boolean
  is_dairy_free: boolean
  contains_nuts: boolean
  contains_dairy: boolean
  contains_seafood: boolean
  contains_eggs: boolean
  contains_soy: boolean
  contains_gluten: boolean
}

interface MenuItemCardProps {
  item: MenuItem
  language: "en" | "it" | "am"
  currency: "USD" | "EUR" | "ETB"
  onAddToOrder: (item: MenuItem) => void
}

export function MenuItemCard({ item, language, currency, onAddToOrder }: MenuItemCardProps) {
  const getName = () => {
    switch (language) {
      case "it":
        return item.name_it || item.name_en
      case "am":
        return item.name_am || item.name_en
      default:
        return item.name_en
    }
  }

  const getDescription = () => {
    switch (language) {
      case "it":
        return item.description_it || item.description_en
      case "am":
        return item.description_am || item.description_en
      default:
        return item.description_en
    }
  }

  const getPrice = () => {
    switch (currency) {
      case "EUR":
        return `€${item.price_eur?.toFixed(2) || item.price_usd.toFixed(2)}`
      case "ETB":
        return `${item.price_etb?.toFixed(2) || (item.price_usd * 50).toFixed(2)} ETB`
      default:
        return `$${item.price_usd.toFixed(2)}`
    }
  }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${!item.is_available ? "opacity-60" : ""}`}>
      <div className="relative">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <Image
            src={item.image_url || "/placeholder.svg"}
            alt={getName()}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {item.is_featured && (
            <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {!item.is_available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Sold Out
              </Badge>
            </div>
          )}
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-card-foreground">{getName()}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {item.preparation_time} min
              </Badge>
              <Badge variant="outline" className="text-xs">
                {item.calories} cal
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">{getPrice()}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">{getDescription()}</CardDescription>

        <DietaryBadges
          isVegetarian={item.is_vegetarian}
          isVegan={item.is_vegan}
          isGlutenFree={item.is_gluten_free}
          isHalal={item.is_halal}
          isDairyFree={item.is_dairy_free}
        />

        <AllergenInfo
          containsNuts={item.contains_nuts}
          containsDairy={item.contains_dairy}
          containsSeafood={item.contains_seafood}
          containsEggs={item.contains_eggs}
          containsSoy={item.contains_soy}
          containsGluten={item.contains_gluten}
        />

        <Button
          onClick={() => onAddToOrder(item)}
          disabled={!item.is_available}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          {item.is_available ? "Add to Order" : "Unavailable"}
        </Button>
      </CardContent>
    </Card>
  )
}
