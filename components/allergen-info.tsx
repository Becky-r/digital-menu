import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

interface AllergenInfoProps {
  containsNuts?: boolean
  containsDairy?: boolean
  containsSeafood?: boolean
  containsEggs?: boolean
  containsSoy?: boolean
  containsGluten?: boolean
  className?: string
}

export function AllergenInfo({
  containsNuts,
  containsDairy,
  containsSeafood,
  containsEggs,
  containsSoy,
  containsGluten,
  className,
}: AllergenInfoProps) {
  const allergens = []

  if (containsNuts) allergens.push("Nuts")
  if (containsDairy) allergens.push("Dairy")
  if (containsSeafood) allergens.push("Seafood")
  if (containsEggs) allergens.push("Eggs")
  if (containsSoy) allergens.push("Soy")
  if (containsGluten) allergens.push("Gluten")

  if (allergens.length === 0) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center text-orange-600">
        <AlertTriangle className="h-4 w-4 mr-1" />
        <span className="text-sm font-medium">Contains:</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {allergens.map((allergen) => (
          <Badge key={allergen} variant="outline" className="text-orange-600 border-orange-600 bg-orange-50">
            {allergen}
          </Badge>
        ))}
      </div>
    </div>
  )
}
