"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Edit, Trash2, Search } from "lucide-react"
import { formatCurrency } from "@/lib/form-utils"

interface Beneficiary {
  id: string
  name: string
  bank: string
  accountNumber: string
  phone: string
  balance: number
  type: "Business" | "P2P"
  location: string
  avatar: string
}

interface BeneficiaryManagementProps {
  onBack: () => void
}

export function BeneficiaryManagement({ onBack }: BeneficiaryManagementProps) {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: "1",
      name: "Pedro Banabas",
      bank: "First Bank",
      accountNumber: "0348483930",
      phone: "+234 803 123 4567",
      balance: 25000,
      type: "P2P",
      location: "Lagos, Nigeria",
      avatar: "P",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      bank: "GTBank",
      accountNumber: "0123456789",
      phone: "+234 801 987 6543",
      balance: 50000,
      type: "Business",
      location: "Abuja, Nigeria",
      avatar: "S",
    },
    {
      id: "3",
      name: "Mike Adebayo",
      bank: "Access Bank",
      accountNumber: "0987654321",
      phone: "+234 805 555 1234",
      balance: 15000,
      type: "P2P",
      location: "Ibadan, Nigeria",
      avatar: "M",
    },
    // Add 20 sample beneficiaries
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `sample-${i + 4}`,
      name: `Sample Beneficiary ${i + 1}`,
      bank: `Sample Bank ${i + 1}`,
      accountNumber: `123456789${i}`,
      phone: `+234 800 000 00${i}`,
      balance: Math.floor(Math.random() * 100000),
      type: i % 2 === 0 ? "P2P" : "Business",
      location: `City ${i + 1}, Nigeria`,
      avatar: `SB${i + 1}`,
    })),
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null)
  const [newBeneficiary, setNewBeneficiary] = useState<Partial<Beneficiary>>({
    name: "",
    bank: "",
    accountNumber: "",
    phone: "",
    balance: 0,
    type: "P2P",
    location: "",
  })

  const filteredBeneficiaries = beneficiaries.filter(
    (beneficiary) =>
      beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.accountNumber.includes(searchTerm),
  )

  const handleAddBeneficiary = () => {
    if (newBeneficiary.name && newBeneficiary.bank && newBeneficiary.accountNumber) {
      const beneficiary: Beneficiary = {
        id: Date.now().toString(),
        name: newBeneficiary.name,
        bank: newBeneficiary.bank,
        accountNumber: newBeneficiary.accountNumber,
        phone: newBeneficiary.phone || "",
        balance: newBeneficiary.balance || 0,
        type: newBeneficiary.type as "Business" | "P2P",
        location: newBeneficiary.location || "Nigeria",
        avatar: newBeneficiary.name.charAt(0).toUpperCase(),
      }
      setBeneficiaries([...beneficiaries, beneficiary])
      setNewBeneficiary({
        name: "",
        bank: "",
        accountNumber: "",
        phone: "",
        balance: 0,
        type: "P2P",
        location: "",
      })
      setShowAddModal(false)
    }
  }

  const handleEditBeneficiary = (beneficiary: Beneficiary) => {
    setEditingBeneficiary(beneficiary)
    setNewBeneficiary(beneficiary)
    setShowAddModal(true)
  }

  const handleUpdateBeneficiary = () => {
    if (editingBeneficiary && newBeneficiary.name && newBeneficiary.bank && newBeneficiary.accountNumber) {
      const updatedBeneficiaries = beneficiaries.map((b) =>
        b.id === editingBeneficiary.id
          ? { ...b, ...newBeneficiary, avatar: newBeneficiary.name!.charAt(0).toUpperCase() }
          : b,
      )
      setBeneficiaries(updatedBeneficiaries)
      setEditingBeneficiary(null)
      setNewBeneficiary({
        name: "",
        bank: "",
        accountNumber: "",
        phone: "",
        balance: 0,
        type: "P2P",
        location: "",
      })
      setShowAddModal(false)
    }
  }

  const handleDeleteBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter((b) => b.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b md:px-6 md:py-5">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold md:text-xl">Beneficiary Management</h1>
        <Button size="icon" className="bg-[#004A9F] hover:bg-[#003875]" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-4 py-6 space-y-6 md:px-6 md:py-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search beneficiaries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 md:pl-12"
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-lg font-bold text-[#004A9F] md:text-xl">{beneficiaries.length}</div>
              <div className="text-xs text-gray-600 md:text-sm">Total</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-lg font-bold text-[#00B2A9] md:text-xl">
                {beneficiaries.filter((b) => b.type === "Business").length}
              </div>
              <div className="text-xs text-gray-600 md:text-sm">Business</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-lg font-bold text-[#A4D233] md:text-xl">
                {beneficiaries.filter((b) => b.type === "P2P").length}
              </div>
              <div className="text-xs text-gray-600 md:text-sm">P2P</div>
            </CardContent>
          </Card>
        </div>

        {/* Beneficiaries List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">All Beneficiaries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredBeneficiaries.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#004A9F] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{beneficiary.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm md:text-base">{beneficiary.name}</div>
                    <div className="text-xs text-gray-600 md:text-sm">
                      {beneficiary.bank} • {beneficiary.accountNumber}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className={`text-xs md:text-sm ${
                          beneficiary.type === "Business"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {beneficiary.type}
                      </Badge>
                      <span className="text-xs text-gray-500 md:text-sm">{beneficiary.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 md:mt-0">
                  <div className="text-right mr-2">
                    <div className="text-sm font-medium md:text-base">₦{formatCurrency(beneficiary.balance)}</div>
                    <div className="text-xs text-gray-500 md:text-sm">{beneficiary.phone}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleEditBeneficiary(beneficiary)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteBeneficiary(beneficiary.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Beneficiary Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              {editingBeneficiary ? "Edit Beneficiary" : "Add New Beneficiary"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newBeneficiary.name || ""}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <Label htmlFor="bank">Bank</Label>
              <Select
                value={newBeneficiary.bank}
                onValueChange={(value) => setNewBeneficiary({ ...newBeneficiary, bank: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First Bank">First Bank</SelectItem>
                  <SelectItem value="GTBank">GTBank</SelectItem>
                  <SelectItem value="Access Bank">Access Bank</SelectItem>
                  <SelectItem value="Zenith Bank">Zenith Bank</SelectItem>
                  <SelectItem value="UBA">UBA</SelectItem>
                  <SelectItem value="Ecobank">Ecobank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={newBeneficiary.accountNumber || ""}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, accountNumber: e.target.value })}
                placeholder="Enter account number"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={newBeneficiary.phone || ""}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <Label htmlFor="balance">Balance (₦)</Label>
              <Input
                id="balance"
                type="number"
                inputMode="numeric"
                step="0.01"
                value={newBeneficiary.balance || ""}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, balance: Number(e.target.value) || 0 })}
                placeholder="Enter balance"
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={newBeneficiary.type}
                onValueChange={(value) => setNewBeneficiary({ ...newBeneficiary, type: value as "Business" | "P2P" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P2P">P2P</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newBeneficiary.location || ""}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, location: e.target.value })}
                placeholder="Enter location"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={editingBeneficiary ? handleUpdateBeneficiary : handleAddBeneficiary}
                className="flex-1 bg-[#004A9F] hover:bg-[#003875]"
              >
                {editingBeneficiary ? "Update" : "Add"} Beneficiary
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
