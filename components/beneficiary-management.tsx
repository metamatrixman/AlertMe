"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Building2,
  User,
  Phone,
  CreditCard,
  Wallet,
  Clock,
  RefreshCw
} from "@/components/ui/iconify-compat"
import { formatCurrency } from "@/lib/form-utils"
import { dataStore } from "@/lib/data-store"
import { useToast } from "@/hooks/use-toast"
import { NIGERIAN_BANKS } from "@/lib/banks-data"

interface BeneficiaryUIData {
  id: string
  name: string
  bank: string
  accountNumber: string
  phone?: string
  balance?: string
  type?: "Business" | "P2P"
  location?: string
  createdAt?: string
}

interface BeneficiaryManagementProps {
  onBack: () => void
}

export function BeneficiaryManagement({ onBack }: BeneficiaryManagementProps) {
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryUIData[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "Business" | "P2P">("all")
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const { toast } = useToast()

  // Load beneficiaries from dataStore on mount
  useEffect(() => {
    const loadBeneficiaries = () => {
      const stored = dataStore.getBeneficiaries()
      setBeneficiaries(
        stored.map((b) => ({
          id: b.id,
          name: b.name,
          bank: b.bank,
          accountNumber: b.accountNumber,
          phone: b.phone || "",
          type: "P2P" as const,
          location: "Nigeria",
          createdAt: new Date().toISOString(),
        })),
      )
      setLastRefreshed(new Date())
    }

    loadBeneficiaries()

    // Subscribe to dataStore changes
    const unsubscribe = dataStore.subscribe(loadBeneficiaries)
    return () => unsubscribe()
  }, [])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBeneficiary, setEditingBeneficiary] = useState<BeneficiaryUIData | null>(null)
  const [newBeneficiary, setNewBeneficiary] = useState<Partial<BeneficiaryUIData>>({
    name: "",
    bank: "",
    accountNumber: "",
    phone: "",
    balance: "",
    type: "P2P",
    location: "Nigeria",
  })

  const filteredBeneficiaries = beneficiaries.filter(
    (beneficiary) =>
      (beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.accountNumber.includes(searchTerm)) &&
      (filterType === "all" || beneficiary.type === filterType)
  )

  const handleAddBeneficiary = () => {
    if (newBeneficiary.name && newBeneficiary.bank && newBeneficiary.accountNumber) {
      try {
        dataStore.addBeneficiary({
          name: newBeneficiary.name,
          bank: newBeneficiary.bank,
          accountNumber: newBeneficiary.accountNumber,
          phone: newBeneficiary.phone || "",
        })

        toast({
          title: "Success",
          description: `${newBeneficiary.name} added to beneficiaries`,
        })

        setNewBeneficiary({
          name: "",
          bank: "",
          accountNumber: "",
          phone: "",
          balance: "",
          type: "P2P",
          location: "Nigeria",
        })
        setShowAddModal(false)
        setLastRefreshed(new Date())
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to add beneficiary",
          variant: "destructive",
        })
      }
    }
  }

  const handleEditBeneficiary = (beneficiary: BeneficiaryUIData) => {
    setEditingBeneficiary(beneficiary)
    setNewBeneficiary(beneficiary)
    setShowAddModal(true)
  }

  const handleUpdateBeneficiary = () => {
    if (editingBeneficiary && newBeneficiary.name && newBeneficiary.bank && newBeneficiary.accountNumber) {
      try {
        // Delete old beneficiary and add updated one
        dataStore.deleteBeneficiary(editingBeneficiary.id)
        dataStore.addBeneficiary({
          name: newBeneficiary.name,
          bank: newBeneficiary.bank,
          accountNumber: newBeneficiary.accountNumber,
          phone: newBeneficiary.phone || "",
        })

        toast({
          title: "Success",
          description: "Beneficiary updated",
        })

        setEditingBeneficiary(null)
        setNewBeneficiary({
          name: "",
          bank: "",
          accountNumber: "",
          phone: "",
          balance: "",
          type: "P2P",
          location: "Nigeria",
        })
        setShowAddModal(false)
        setLastRefreshed(new Date())
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to update beneficiary",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteBeneficiary = (id: string, name: string) => {
    try {
      dataStore.deleteBeneficiary(id)
      toast({
        title: "Deleted",
        description: `${name} removed from beneficiaries`,
      })
      setShowDeleteConfirm(null)
      setLastRefreshed(new Date())
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete beneficiary",
        variant: "destructive",
      })
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id)
  }

  const getBankLogo = (bankName: string) => {
    const bank = NIGERIAN_BANKS.find(b => b.name.toLowerCase() === bankName.toLowerCase())
    return bankName.charAt(0)
  }

  const getBankColor = (bankName: string) => {
    const colors = [
      "bg-gradient-to-br from-[#004A9F] to-[#003875]", // Blue
      "bg-gradient-to-br from-[#00B2A9] to-[#008B8A]", // Teal
      "bg-gradient-to-br from-[#A4D233] to-[#8BB82D]", // Green
      "bg-gradient-to-br from-[#FF6B00] to-[#E55F00]", // Orange
      "bg-gradient-to-br from-[#6B3FA0] to-[#5A3288]", // Purple
    ]
    const index = bankName.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header - Fixed */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b sticky top-0 z-10 md:px-6 md:py-5">
        <Button variant="ghost" size="icon" onClick={onBack} className="flex-shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center md:text-xl">Beneficiary Management</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setLastRefreshed(new Date())
              const stored = dataStore.getBeneficiaries()
              setBeneficiaries(
                stored.map((b) => ({
                  id: b.id,
                  name: b.name,
                  bank: b.bank,
                  accountNumber: b.accountNumber,
                  phone: b.phone || "",
                  type: "P2P" as const,
                  location: "Nigeria",
                  createdAt: new Date().toISOString(),
                })),
              )
            }}
            className="flex-shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="bg-[#004A9F] hover:bg-[#003875] flex-shrink-0"
            onClick={() => {
              setEditingBeneficiary(null)
              setNewBeneficiary({
                name: "",
                bank: "",
                accountNumber: "",
                phone: "",
                balance: "",
                type: "P2P",
                location: "Nigeria",
              })
              setShowAddModal(true)
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 md:px-6 md:py-8">
        {/* Search and Filter */}
        <div className="sticky top-0 bg-gray-50 z-5 pb-2 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search beneficiaries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white md:pl-12"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <Button
              size="sm"
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
              className={filterType === "all" ? "bg-[#004A9F] hover:bg-[#003875] whitespace-nowrap" : "whitespace-nowrap"}
            >
              All ({beneficiaries.length})
            </Button>
            <Button
              size="sm"
              variant={filterType === "Business" ? "default" : "outline"}
              onClick={() => setFilterType("Business")}
              className={filterType === "Business" ? "bg-blue-600 hover:bg-blue-700 whitespace-nowrap" : "whitespace-nowrap"}
            >
              <Building2 className="h-3 w-3 mr-1" />
              Business ({beneficiaries.filter((b) => b.type === "Business").length})
            </Button>
            <Button
              size="sm"
              variant={filterType === "P2P" ? "default" : "outline"}
              onClick={() => setFilterType("P2P")}
              className={filterType === "P2P" ? "bg-green-600 hover:bg-green-700 whitespace-nowrap" : "whitespace-nowrap"}
            >
              <User className="h-3 w-3 mr-1" />
              P2P ({beneficiaries.filter((b) => b.type === "P2P").length})
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:gap-4">
          <Card className="text-center">
            <CardContent className="p-3 md:p-4">
              <div className="text-xl font-bold text-[#004A9F] md:text-2xl">{beneficiaries.length}</div>
              <div className="text-xs text-gray-600 md:text-sm">Total</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3 md:p-4">
              <div className="text-xl font-bold text-[#00B2A9] md:text-2xl">
                {beneficiaries.filter((b) => b.type === "Business").length}
              </div>
              <div className="text-xs text-gray-600 md:text-sm">Business</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3 md:p-4">
              <div className="text-xl font-bold text-[#A4D233] md:text-2xl">
                {beneficiaries.filter((b) => b.type === "P2P").length}
              </div>
              <div className="text-xs text-gray-600 md:text-sm">P2P</div>
            </CardContent>
          </Card>
        </div>

        {/* Beneficiaries List - Single Column Layout */}
        <Card className="flex flex-col">
          <CardHeader className="border-b bg-white sticky top-0 z-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[#004A9F]" />
                All Beneficiaries
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {filteredBeneficiaries.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <Clock className="h-3 w-3" />
              <span>Last updated: {lastRefreshed.toLocaleTimeString()}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {filteredBeneficiaries.length === 0 ? (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No beneficiaries found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredBeneficiaries.map((beneficiary) => (
                  <div
                    key={beneficiary.id}
                    className={`relative bg-white hover:bg-gray-50 transition-all duration-200 ${
                      expandedItem === beneficiary.id ? "bg-gray-50" : ""
                    }`}
                  >
                    {/* Main Row */}
                    <div
                      className="flex items-center p-4 cursor-pointer"
                      onClick={() => toggleExpand(beneficiary.id)}
                    >
                      {/* Logo */}
                      <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm ${getBankColor(beneficiary.bank)}`}>
                        {getBankLogo(beneficiary.bank)}
                      </div>

                      {/* Beneficiary Info */}
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white truncate">
                            {beneficiary.name}
                          </span>
                          {expandedItem === beneficiary.id ? (
                            <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge
                            className={`text-xs ${
                              beneficiary.type === "Business"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-green-100 text-green-800 border-green-200"
                            }`}
                          >
                            {beneficiary.type || "P2P"}
                          </Badge>
                          <span className="text-xs text-gray-600 truncate">
                            {beneficiary.bank} • {beneficiary.accountNumber}
                          </span>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {expandedItem === beneficiary.id && (
                      <div className="px-4 pb-4 pt-0 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700">
                        <div className="pt-3 space-y-3">
                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                Bank
                              </span>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {beneficiary.bank}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                Account Number
                              </span>
                              <div className="font-medium text-gray-900 dark:text-white font-mono">
                                {beneficiary.accountNumber}
                              </div>
                            </div>
                            {beneficiary.phone && (
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  Phone
                                </span>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {beneficiary.phone}
                                </div>
                              </div>
                            )}
                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Wallet className="h-3 w-3" />
                                Type
                              </span>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {beneficiary.type || "P2P"}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditBeneficiary(beneficiary)
                              }}
                              className="text-xs flex-1"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowDeleteConfirm(beneficiary.id)
                              }}
                              className="text-xs flex-1"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Beneficiary Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-[#004A9F] via-[#0072C6] to-[#00B2A9] -m-6 mb-4 p-6 rounded-t-2xl border-b border-gray-200/50 dark:border-gray-700/50">
            <DialogTitle className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
              {editingBeneficiary ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Beneficiary
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add New Beneficiary
                </>
              )}
            </DialogTitle>
            <p className="text-sm text-white/80 mt-1">
              {editingBeneficiary ? "Update beneficiary details" : "Enter recipient information"}
            </p>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {/* Beneficiary Type Selection */}
            <div>
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Beneficiary Type</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  size="sm"
                  variant={newBeneficiary.type === "Business" ? "default" : "outline"}
                  onClick={() => setNewBeneficiary({ ...newBeneficiary, type: "Business" })}
                  className={`flex-1 ${newBeneficiary.type === "Business" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  Business
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={newBeneficiary.type === "P2P" ? "default" : "outline"}
                  onClick={() => setNewBeneficiary({ ...newBeneficiary, type: "P2P" })}
                  className={`flex-1 ${newBeneficiary.type === "P2P" ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  <User className="h-3 w-3 mr-1" />
                  P2P
                </Button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="name" className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                <User className="h-3 w-3" />
                Full Name
              </Label>
              <Input
                id="name"
                value={newBeneficiary.name || ""}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                placeholder="Enter full name"
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Bank Selection */}
            <div>
              <Label htmlFor="bank" className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                <Building2 className="h-3 w-3" />
                Bank
              </Label>
              <Select
                value={newBeneficiary.bank || ""}
                onValueChange={(value) => setNewBeneficiary({ ...newBeneficiary, bank: value })}
              >
                <SelectTrigger className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {NIGERIAN_BANKS.filter(b => b.type === "bank" || b.type === "microfinance").map((bank) => (
                    <SelectItem key={`${bank.code}-${bank.type}-${bank.name}`} value={bank.name}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Number */}
            <div>
              <Label htmlFor="accountNumber" className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                <CreditCard className="h-3 w-3" />
                Account Number
              </Label>
              <Input
                id="accountNumber"
                value={newBeneficiary.accountNumber || ""}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, accountNumber: e.target.value })}
                placeholder="Enter account number"
                inputMode="numeric"
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 font-mono"
              />
              {/* Account Number Validation Preview */}
              {newBeneficiary.accountNumber && newBeneficiary.accountNumber.length === 10 && (
                <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Valid 10-digit account number</span>
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phone" className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                <Phone className="h-3 w-3" />
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                value={newBeneficiary.phone || ""}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, phone: e.target.value })}
                placeholder="Enter phone number"
                inputMode="tel"
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Account Balance */}
            <div>
              <Label htmlFor="balance" className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                <Wallet className="h-3 w-3" />
                Account Balance (Optional)
              </Label>
              <Input
                id="balance"
                value={newBeneficiary.balance || ""}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, balance: e.target.value })}
                placeholder="Enter account balance"
                inputMode="numeric"
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false)
                  setEditingBeneficiary(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={editingBeneficiary ? handleUpdateBeneficiary : handleAddBeneficiary}
                disabled={!newBeneficiary.name || !newBeneficiary.bank || !newBeneficiary.accountNumber}
                className={`flex-1 bg-[#004A9F] hover:bg-[#003875] ${
                  (!newBeneficiary.name || !newBeneficiary.bank || !newBeneficiary.accountNumber) 
                    ? "opacity-50 cursor-not-allowed" 
                    : ""
                }`}
              >
                {editingBeneficiary ? "Update" : "Add"} Beneficiary
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm !== null} onOpenChange={(open) => !open && setShowDeleteConfirm(null)}>
        <DialogContent className="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-2xl">
          <DialogHeader className="bg-red-50 dark:bg-red-900/20 -m-6 mb-4 p-6 rounded-t-2xl border-b border-red-100/50 dark:border-red-800/50">
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              Delete Beneficiary?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete this beneficiary? This action cannot be undone.
            </p>
            {showDeleteConfirm && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="font-medium text-gray-900 dark:text-white">
                  {beneficiaries.find((b) => b.id === showDeleteConfirm)?.name}
                </div>
                <div className="text-sm text-gray-500">
                  {beneficiaries.find((b) => b.id === showDeleteConfirm)?.bank} • {beneficiaries.find((b) => b.id === showDeleteConfirm)?.accountNumber}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const beneficiary = beneficiaries.find((b) => b.id === showDeleteConfirm)
                  if (beneficiary) {
                    handleDeleteBeneficiary(showDeleteConfirm!, beneficiary.name)
                  }
                }}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
