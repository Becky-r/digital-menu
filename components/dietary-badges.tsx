import { Badge } from "@/components/ui/badge"
import { Leaf, Wheat, Milk, Heart } from "lucide-react"

interface DietaryBadgesProps {
  isVegetarian?: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
  isHalal?: boolean
  isDairyFree?: boolean
  className?: string
}

export function DietaryBadges({
  isVegetarian,
  isVegan,
  isGlutenFree,
  isHalal,
  isDairyFree,
  className,
}: DietaryBadgesProps) {
  const badges = []

  if (isVegan) {
    badges.push(
      <Badge key="vegan" variant="outline" className="text-green-600 border-green-600 bg-green-50">
        <Leaf className="h-3 w-3 mr-1" />
        Vegan
      </Badge>,
    )
  } else if (isVegetarian) {
    badges.push(
      <Badge key="vegetarian" variant="outline" className="text-green-600 border-green-600 bg-green-50">
        <Leaf className="h-3 w-3 mr-1" />
        Vegetarian
      </Badge>,
    )
  }

  if (isGlutenFree) {
    badges.push(
      <Badge key="gluten-free" variant="outline" className="text-amber-600 border-amber-600 bg-amber-50">
        <Wheat className="h-3 w-3 mr-1" />
        Gluten Free
      </Badge>,
    )
  }

  if (isHalal) {
    badges.push(
      <Badge key="halal" variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">
        <Heart className="h-3 w-3 mr-1" />
        Halal
      </Badge>,
    )
  }

  if (isDairyFree) {
    badges.push(
      <Badge key="dairy-free" variant="outline" className="text-purple-600 border-purple-600 bg-purple-50">
        <Milk className="h-3 w-3 mr-1" />
        Dairy Free
      </Badge>,
    )
  }

  if (badges.length === 0) return null

  return <div className={`flex flex-wrap gap-1 ${className}`}>{badges}</div>
}
