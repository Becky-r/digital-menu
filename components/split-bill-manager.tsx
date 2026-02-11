"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, Plus, Minus, UserCheck } from "lucide-react"

interface SplitBillManagerProps {
  items: any[]
  subtotal: number
  tax: number
  tip: number
  currency: "USD" | "EUR" | "ETB"
}

interface Person {
  id: string
  name: string
  items: string[]
  amount: number
}

export function SplitBillManager({ items, subtotal, tax, tip, currency }: SplitBillManagerProps) {
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "Person 1", items: [], amount: 0 },
    { id: "2", name: "Person 2", items: [], amount: 0 },
  ])
  const [splitMethod, setSplitMethod] = useState<"equal" | "items">("equal")

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

  const addPerson = () => {
    const newPerson: Person = {
      id: Date.now().toString(),
      name: `Person ${people.length + 1}`,
      items: [],
      amount: 0,
    }
    setPeople([...people, newPerson])
  }

  const removePerson = (personId: string) => {
    if (people.length > 2) {
      setPeople(people.filter((p) => p.id !== personId))
    }
  }

  const updatePersonName = (personId: string, name: string) => {
    setPeople(people.map((p) => (p.id === personId ? { ...p, name } : p)))
  }

  const toggleItemForPerson = (personId: string, itemId: string) => {
    setPeople(
      people.map((person) => {
        if (person.id === personId) {
          const hasItem = person.items.includes(itemId)
          const newItems = hasItem ? person.items.filter((id) => id !== itemId) : [...person.items, itemId]

          // Calculate amount based on selected items
          const amount = newItems.reduce((total, id) => {
            const item = items.find((i) => i.id === id)
            return total + (item ? item.price * item.quantity : 0)
          }, 0)

          return { ...person, items: newItems, amount }
        }
        return person
      }),
    )
  }

  const calculateEqualSplit = () => {
    const totalWithTaxAndTip = subtotal + tax + tip
    return totalWithTaxAndTip / people.length
  }

  const calculateItemBasedSplit = () => {
    const assignedItemsTotal = people.reduce((total, person) => total + person.amount, 0)
    const unassignedAmount = subtotal - assignedItemsTotal
    const taxAndTipPerPerson = (tax + tip) / people.length

    return people.map((person) => ({
      ...person,
      finalAmount: person.amount + (person.amount / subtotal) * unassignedAmount + taxAndTipPerPerson,
    }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Split Bill
          </CardTitle>
          <CardDescription>Divide the bill among {people.length} people</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={splitMethod === "equal" ? "default" : "outline"}
              onClick={() => setSplitMethod("equal")}
              size="sm"
            >
              Split Equally
            </Button>
            <Button
              variant={splitMethod === "items" ? "default" : "outline"}
              onClick={() => setSplitMethod("items")}
              size="sm"
            >
              Split by Items
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={addPerson} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Person
            </Button>
            <span className="text-sm text-muted-foreground">{people.length} people splitting the bill</span>
          </div>
        </CardContent>
      </Card>

      {splitMethod === "equal" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Equal Split</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {people.map((person, index) => (
                <div key={person.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Input
                      value={person.name}
                      onChange={(e) => updatePersonName(person.id, e.target.value)}
                      className="w-32"
                    />
                    <UserCheck className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-lg">
                      {formatPrice(calculateEqualSplit())}
                    </Badge>
                    {people.length > 2 && (
                      <Button
                        onClick={() => removePerson(person.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {people.map((person) => (
            <Card key={person.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Input
                    value={person.name}
                    onChange={(e) => updatePersonName(person.id, e.target.value)}
                    className="w-40"
                  />
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{formatPrice(person.amount)}</Badge>
                    {people.length > 2 && (
                      <Button
                        onClick={() => removePerson(person.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={person.items.includes(item.id)}
                          onChange={() => toggleItemForPerson(person.id, item.id)}
                          className="rounded"
                        />
                        <span className="text-sm">
                          {item.name} x{item.quantity}
                        </span>
                      </div>
                      <span className="text-sm">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Final Split</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {calculateItemBasedSplit().map((person) => (
                  <div key={person.id} className="flex justify-between items-center">
                    <span className="font-medium">{person.name}</span>
                    <Badge variant="secondary" className="text-lg">
                      {formatPrice(person.finalAmount)}
                    </Badge>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(subtotal + tax + tip)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
