"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Globe, DollarSign, Filter, Heart } from "lucide-react"
import { MenuCategoryNav } from "@/components/menu-category-nav"
import { MenuItemCard } from "@/components/menu-item-card"
import { OrderCustomizationModal } from "@/components/order-customization-modal"
import { ShoppingCartSheet } from "@/components/shopping-cart"
import { TableSelector } from "@/components/table-selector"
import { FavoritesManager } from "@/components/favorites-manager"
import { useOrder } from "@/lib/order-context"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Mock data - in real app this would come from API/database
const mockCategories = [
  { id: 1, name_en: "Starters", name_it: "Antipasti", name_am: "መክሰስ", display_order: 1 },
  { id: 2, name_en: "Main Course", name_it: "Piatti Principali", name_am: "ዋና ምግብ", display_order: 2 },
  { id: 3, name_en: "Desserts", name_it: "Dolci", name_am: "ጣፋጭ", display_order: 3 },
  { id: 4, name_en: "Drinks", name_it: "Bevande", name_am: "መጠጦች", display_order: 4 },
]

const mockMenuItems = [
  {
    id: 1,
    category_id: 1,
    name_en: "Bruschetta Trio",
    name_it: "Trio di Bruschette",
    name_am: "ብሩሽቴታ ሶስት",
    description_en: "Three varieties of our signature bruschetta with fresh tomatoes, basil, and mozzarella",
    description_it: "Tre varietà della nostra bruschetta con pomodori freschi, basilico e mozzarella",
    description_am: "በትኩስ ቲማቲም፣ በባዚል እና በሞዛሬላ የተሰራ የእኛ ልዩ ብሩሽቴታ ሶስት ዓይነት",
    price_usd: 12.99,
    price_eur: 11.5,
    price_etb: 650,
    image_url: "/bruschetta-trio.png",
    is_available: true,
    is_featured: true,
    preparation_time: 10,
    calories: 320,
    is_vegetarian: true,
    is_vegan: false,
    is_gluten_free: false,
    is_halal: true,
    is_dairy_free: false,
    contains_nuts: false,
    contains_dairy: true,
    contains_seafood: false,
    contains_eggs: false,
    contains_soy: false,
    contains_gluten: true,
  },
  {
    id: 2,
    category_id: 1,
    name_en: "Seafood Platter",
    name_it: "Piatto di Mare",
    name_am: "የባህር ምግብ",
    description_en: "Fresh selection of grilled shrimp, calamari, and fish with lemon herbs",
    description_it: "Selezione fresca di gamberi grigliati, calamari e pesce con erbe al limone",
    description_am: "በሎሚ ቅጠሎች የተቀመመ ግሪል የተደረገ ሽሪምፕ፣ ካላማሪ እና ዓሳ",
    price_usd: 18.99,
    price_eur: 16.5,
    price_etb: 950,
    image_url: "/seafood-platter.png",
    is_available: true,
    is_featured: false,
    preparation_time: 15,
    calories: 280,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: true,
    is_halal: true,
    is_dairy_free: true,
    contains_nuts: false,
    contains_dairy: false,
    contains_seafood: true,
    contains_eggs: false,
    contains_soy: false,
    contains_gluten: false,
  },
  {
    id: 3,
    category_id: 2,
    name_en: "Grilled Salmon",
    name_it: "Salmone Grigliato",
    name_am: "ግሪል ሳልሞን",
    description_en: "Atlantic salmon grilled to perfection with seasonal vegetables and quinoa",
    description_it: "Salmone atlantico grigliato alla perfezione con verdure di stagione e quinoa",
    description_am: "በወቅታዊ አትክልቶች እና በኪኖዋ የተሰራ በጥሩ ሁኔታ ግሪል የተደረገ አትላንቲክ ሳልሞን",
    price_usd: 26.99,
    price_eur: 24.0,
    price_etb: 1350,
    image_url: "/grilled-salmon-vegetables.png",
    is_available: true,
    is_featured: true,
    preparation_time: 20,
    calories: 450,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: true,
    is_halal: true,
    is_dairy_free: true,
    contains_nuts: false,
    contains_dairy: false,
    contains_seafood: true,
    contains_eggs: false,
    contains_soy: false,
    contains_gluten: false,
  },
  {
    id: 4,
    category_id: 2,
    name_en: "Vegetarian Pasta",
    name_it: "Pasta Vegetariana",
    name_am: "የቬጀቴሪያን ፓስታ",
    description_en: "Homemade pasta with roasted vegetables, basil pesto, and parmesan cheese",
    description_it: "Pasta fatta in casa con verdure arrostite, pesto di basilico e parmigiano",
    description_am: "በተጠበሰ አትክልት፣ በባዚል ፔስቶ እና በፓርሜዛን ቺዝ የተሰራ የቤት ፓስታ",
    price_usd: 19.99,
    price_eur: 17.5,
    price_etb: 1000,
    image_url: "/vegetarian-pesto-pasta.png",
    is_available: false,
    is_featured: false,
    preparation_time: 18,
    calories: 520,
    is_vegetarian: true,
    is_vegan: false,
    is_gluten_free: false,
    is_halal: true,
    is_dairy_free: false,
    contains_nuts: false,
    contains_dairy: true,
    contains_seafood: false,
    contains_eggs: false,
    contains_soy: false,
    contains_gluten: true,
  },
]

export default function MenuPage() {
  const { state, dispatch } = useOrder()
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredItems, setFilteredItems] = useState(mockMenuItems)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false)

  // Mock customization options - in real app this would come from API
  const mockCustomizationOptions = [
    {
      id: 1,
      option_type: "cooking",
      name_en: "Medium Rare",
      name_it: "Medio al Sangue",
      name_am: "መካከለኛ ጥሬ",
      price_modifier: 0,
      is_required: true,
    },
    {
      id: 2,
      option_type: "cooking",
      name_en: "Medium",
      name_it: "Medio",
      name_am: "መካከለኛ",
      price_modifier: 0,
      is_required: true,
    },
    {
      id: 3,
      option_type: "cooking",
      name_en: "Well Done",
      name_it: "Ben Cotto",
      name_am: "በደንብ የበሰለ",
      price_modifier: 0,
      is_required: true,
    },
    {
      id: 4,
      option_type: "side",
      name_en: "Extra Vegetables",
      name_it: "Verdure Extra",
      name_am: "ተጨማሪ አትክልት",
      price_modifier: 3.0,
      is_required: false,
    },
    {
      id: 5,
      option_type: "topping",
      name_en: "Extra Cheese",
      name_it: "Formaggio Extra",
      name_am: "ተጨማሪ አይብ",
      price_modifier: 2.5,
      is_required: false,
    },
  ]

  useEffect(() => {
    // Sync language and currency with order context
    dispatch({ type: "SET_LANGUAGE", payload: state.language })
    dispatch({ type: "SET_CURRENCY", payload: state.currency })
  }, [])

  useEffect(() => {
    let filtered = mockMenuItems

    // Filter by category
    if (activeCategory !== null) {
      filtered = filtered.filter((item) => item.category_id === activeCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description_en.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredItems(filtered)
  }, [activeCategory, searchQuery])

  const handleAddToOrder = (item: any) => {
    setSelectedItem(item)
    setIsCustomizationOpen(true)
  }

  const handleLanguageChange = (language: "en" | "it" | "am") => {
    dispatch({ type: "SET_LANGUAGE", payload: language })
  }

  const handleCurrencyChange = (currency: "USD" | "EUR" | "ETB") => {
    dispatch({ type: "SET_CURRENCY", payload: currency })
  }

  const getLanguageLabel = () => {
    switch (state.language) {
      case "it":
        return "IT"
      case "am":
        return "አም"
      default:
        return "EN"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">DM</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Digital Menu</h1>
            </div>
            <div className="flex items-center space-x-2">
              <TableSelector />
              <Select value={state.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-20">
                  <Globe className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="am">አም</SelectItem>
                </SelectContent>
              </Select>
              <Select value={state.currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="w-24">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="ETB">ETB</SelectItem>
                </SelectContent>
              </Select>
              <ShoppingCartSheet />
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Favorite Orders</SheetTitle>
                  <SheetDescription>Save and reorder your favorite combinations</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <FavoritesManager />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <MenuCategoryNav
        categories={mockCategories}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
        language={state.language}
      />

      {/* Menu Items Grid */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {activeCategory
                ? mockCategories.find((c) => c.id === activeCategory)?.[`name_${state.language}`] || "Menu Items"
                : "All Menu Items"}
            </h2>
            <p className="text-muted-foreground">
              {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} available
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            <Filter className="h-3 w-3 mr-1" />
            {state.currency} • {getLanguageLabel()}
          </Badge>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No menu items found</p>
            <p className="text-muted-foreground">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                language={state.language}
                currency={state.currency}
                onAddToOrder={handleAddToOrder}
              />
            ))}
          </div>
        )}
      </main>

      {/* Order Customization Modal */}
      <OrderCustomizationModal
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        item={selectedItem}
        customizationOptions={mockCustomizationOptions}
      />
    </div>
  )
}
