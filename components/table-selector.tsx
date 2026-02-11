"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Hash } from "lucide-react"
import { useOrder } from "@/lib/order-context"

export function TableSelector() {
  const { state, dispatch } = useOrder()
  const [isOpen, setIsOpen] = useState(false)
  const [tableNumber, setTableNumber] = useState("")

  const handleSetTable = () => {
    if (tableNumber.trim()) {
      dispatch({ type: "SET_TABLE", payload: tableNumber.trim() })
      setIsOpen(false)
      setTableNumber("")
    }
  }

  const handleQRScan = () => {
    // In a real app, this would open camera for QR scanning
    // For demo, we'll simulate scanning table 5
    const simulatedTableNumber = "5"
    dispatch({ type: "SET_TABLE", payload: simulatedTableNumber })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="h-4 w-4 mr-2" />
          {state.tableNumber ? `Table ${state.tableNumber}` : "Select Table"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Your Table</DialogTitle>
          <DialogDescription>Enter your table number or scan the QR code at your table</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="table-number">Table Number</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="table-number"
                  placeholder="Enter table number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSetTable} disabled={!tableNumber.trim()}>
                Set Table
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button onClick={handleQRScan} variant="outline" className="w-full bg-transparent">
            <QrCode className="h-4 w-4 mr-2" />
            Scan QR Code
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
