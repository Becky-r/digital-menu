"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Category {
  id: number
  name_en: string
  name_it: string
  name_am: string
  display_order: number
}

interface MenuCategoryNavProps {
  categories: Category[]
  activeCategory: number | null
  onCategorySelect: (categoryId: number | null) => void
  language: "en" | "it" | "am"
}

export function MenuCategoryNav({ categories, activeCategory, onCategorySelect, language }: MenuCategoryNavProps) {
  const getCategoryName = (category: Category) => {
    switch (language) {
      case "it":
        return category.name_it || category.name_en
      case "am":
        return category.name_am || category.name_en
      default:
        return category.name_en
    }
  }

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-card border-b sticky top-0 z-10">
      <Button
        variant={activeCategory === null ? "default" : "outline"}
        onClick={() => onCategorySelect(null)}
        className={cn("transition-all duration-200", activeCategory === null && "bg-primary text-primary-foreground")}
      >
        All Items
      </Button>
      {categories
        .sort((a, b) => a.display_order - b.display_order)
        .map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => onCategorySelect(category.id)}
            className={cn(
              "transition-all duration-200",
              activeCategory === category.id && "bg-primary text-primary-foreground",
            )}
          >
            {getCategoryName(category)}
          </Button>
        ))}
    </div>
  )
}
