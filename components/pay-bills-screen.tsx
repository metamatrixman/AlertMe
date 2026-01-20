"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Zap, Wifi, Tv, Phone, Car, Home, Receipt } from "@/components/ui/iconify-compat"
import { formatCurrency } from "@/lib/form-utils"

interface PayBillsScreenProps {
  onBack: () => void
  onNavigate: (screen: string) => void
}

export function PayBillsScreen({ onBack, onNavigate }: PayBillsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("")
  const [customerID, setCustomerID] = useState("")
  const [amount, setAmount] = useState("")

  const billCategories = [
    {
      id: "electricity",
      name: "Electricity",
      icon: Zap,
      providers: ["AEDC", "EKEDC", "IKEDC", "PHEDC"],
    },
    {
      id: "internet",
      name: "Internet",
      icon: Wifi,
      providers: ["MTN", "Airtel", "Glo", "9mobile"],
    },
    {
      id: "cable-tv",
      name: "Cable TV",
      icon: Tv,
      providers: ["DSTV", "GOTV", "Startimes", "Strong"],
    },
    {
      id: "phone",
      name: "Phone",
      icon: Phone,
      providers: ["MTN", "Airtel", "Glo", "9mobile"],
    },
    {
      id: "insurance",
      name: "Insurance",
      icon: Car,
      providers: ["Leadway", "AXA Mansard", "AIICO", "Cornerstone"],
    },
    {
      id: "mortgage",
      name: "Mortgage",
      icon: Home,
      providers: ["FMBN", "Abbey Mortgage", "Imperial Homes", "Mixta Real Estate"],
    },
  ]

  const recentBills = [
    {
      id: "1",
      category: "Electricity",
      provider: "AEDC",
      amount: 15000,
      date: "2023-05-15",
      status: "Paid",
    },
    {
      id: "2",
      category: "Cable TV",
      provider: "DSTV",
      amount: 8500,
      date: "2023-05-10",
      status: "Paid",
    },
  ]

  const selectedCategoryData = billCategories.find((cat) => cat.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Pay Bills</h1>
        <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
          <Home className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Bill Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select Bill Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {billCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`h-20 flex flex-col gap-2 ${
                      selectedCategory === category.id
                        ? "bg-[#004A9F] hover:bg-[#003875]"
                        : "border-gray-200 bg-transparent"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <IconComponent className="h-6 w-6" />
                    <span className="text-xs">{category.name}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bill Payment Form */}
        {selectedCategory && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="provider">Service Provider</Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategoryData?.providers.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customer-id">Customer ID / Phone Number</Label>
                <Input
                  id="customer-id"
                  inputMode="tel"
                  value={customerID}
                  onChange={(e) => setCustomerID(e.target.value)}
                  placeholder="Enter customer ID or phone number"
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  inputMode="numeric"
                  step="0.01"
                  placeholder="Enter amount (e.g. 1000.00)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}
                  onBlur={() => {
                    if (!amount) return
                    const n = Number(amount)
                    setAmount(Number(n.toFixed(2)).toFixed(2))
                  }}
                />
              </div>

              <Button
                className="w-full bg-[#A4D233] hover:bg-[#8BC220] text-black py-3"
                disabled={!selectedProvider || !customerID || !amount}
              >
                Pay Bill
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recent Bills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Recent Bills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-sm">
                      {bill.category} - {bill.provider}
                    </div>
                    <div className="text-xs text-gray-500">{new Date(bill.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₦{formatCurrency(bill.amount)}</div>
                  <div className="text-xs text-green-600">{bill.status}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
