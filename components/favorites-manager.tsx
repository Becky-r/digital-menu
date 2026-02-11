"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Plus, Clock } from "lucide-react"
import { useOrder } from "@/lib/order-context"

interface FavoriteOrder {
  id: string
  name: string
  items: any[]
  totalPrice: number
  createdAt: string
}

export function FavoritesManager() {
  const { state, dispatch } = useOrder()
  const [favorites, setFavorites] = useState<FavoriteOrder[]>([])

  useEffect(() => {
    const savedFavorites = localStorage.getItem("digitalMenuFavorites")
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error("Failed to load favorites:", error)
      }
    }
  }, [])

  const saveFavorites = (newFavorites: FavoriteOrder[]) => {
    setFavorites(newFavorites)
    localStorage.setItem("digitalMenuFavorites", JSON.stringify(newFavorites))
  }

  const saveCurrentOrder = () => {
    if (state.items.length === 0) return

    const favorite: FavoriteOrder = {
      id: `fav-${Date.now()}`,
      name: `Order ${new Date().toLocaleDateString()}`,
      items: state.items,
      totalPrice: state.items.reduce((total, item) => total + item.price * item.quantity, 0),
      createdAt: new Date().toISOString(),
    }

    const newFavorites = [favorite, ...favorites.slice(0, 9)] // Keep only 10 favorites
    saveFavorites(newFavorites)
  }

  const reorderFavorite = (favorite: FavoriteOrder) => {
    // Clear current order and add favorite items
    dispatch({ type: "CLEAR_ORDER" })
    favorite.items.forEach((item) => {
      dispatch({ type: "ADD_ITEM", payload: item })
    })
  }

  const removeFavorite = (favoriteId: string) => {
    const newFavorites = favorites.filter((fav) => fav.id !== favoriteId)
    saveFavorites(newFavorites)
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

  return (
    <div className="space-y-4">
      {state.items.length > 0 && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Save Current Order</h3>
          <Button onClick={saveCurrentOrder} variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Save as Favorite
          </Button>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Your Favorite Orders</h3>
          <div className="grid gap-3">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm">{favorite.name}</CardTitle>
                      <CardDescription className="text-xs">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(favorite.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {formatPrice(favorite.totalPrice)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      {favorite.items.length} item{favorite.items.length !== 1 ? "s" : ""}:{" "}
                      {favorite.items
                        .slice(0, 2)
                        .map((item) => item.name)
                        .join(", ")}
                      {favorite.items.length > 2 && ` +${favorite.items.length - 2} more`}
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => reorderFavorite(favorite)} size="sm" className="flex-1">
                        <Plus className="h-3 w-3 mr-1" />
                        Reorder
                      </Button>
                      <Button
                        onClick={() => removeFavorite(favorite.id)}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
