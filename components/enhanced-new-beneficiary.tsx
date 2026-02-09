"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  ChevronDown,
  Home,
  Loader2,
  User,
  Building2,
  CreditCard,
  MessageSquare,
  Star,
  AlertCircle,
} from "lucide-react"
import { dataStore } from "@/lib/data-store"
import { formatCurrency } from "@/lib/form-utils"
import { NIGERIAN_BANKS, PHONE_BASED_WALLETS } from "@/lib/banks-data"

interface EnhancedNewBeneficiaryProps {
  onBack: () => void
  onContinue: (data: any) => void
}

export function EnhancedNewBeneficiary({ onBack, onContinue }: EnhancedNewBeneficiaryProps) {
  const [activeTab, setActiveTab] = useState("New Beneficiary")
  const [formData, setFormData] = useState({
    bank: "",
    accountNumber: "",
    beneficiaryName: "",
    beneficiaryTelephone: "",
    amount: "",
    remark: "",
    saveAsBeneficiary: true,
  })
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupComplete, setLookupComplete] = useState(false)
  const [savedBeneficiaries, setSavedBeneficiaries] = useState<any[]>([])
  const { toast } = useToast()
  const amountInputRef = useRef<HTMLInputElement>(null)

  // Load saved beneficiaries
  useEffect(() => {
    const beneficiaries = dataStore.getBeneficiaries()
    setSavedBeneficiaries(beneficiaries)
  }, [])

  // Handler for selecting a saved beneficiary - populates form and focuses amount field
  const handleSelectBeneficiary = (beneficiary: any) => {
    // Populate form fields with beneficiary data
    setFormData((prev) => ({
      ...prev,
      bank: beneficiary.bank,
      accountNumber: beneficiary.accountNumber,
      beneficiaryName: beneficiary.name,
      beneficiaryTelephone: beneficiary.phone || "",
    }))
    setLookupComplete(true)
    
    // Switch to New Beneficiary tab to show the populated form
    setActiveTab("New Beneficiary")
    
    // Focus on amount input field after a short delay to allow tab switch and state update
    setTimeout(() => {
      amountInputRef.current?.focus()
    }, 100)
  }

  // Auto lookup beneficiary name when account number changes
  useEffect(() => {
    if (formData.accountNumber.length >= 10) {
      setIsLookingUp(true)
      setLookupComplete(false)

      // Simulate API lookup with 5-second delay
      const timer = setTimeout(() => {
        const beneficiary = dataStore.findBeneficiaryByAccount(formData.accountNumber)

        if (beneficiary) {
           setFormData((prev) => ({ ...prev, beneficiaryName: beneficiary.name, beneficiaryTelephone: beneficiary.phone || "" }))
           setLookupComplete(true)
         } else {
           toast({
             title: "Unable to fetch name",
             description: "Unable to fetch name provide account name",
             variant: "destructive",
           })
           setFormData((prev) => {
             const isPhoneBased = PHONE_BASED_WALLETS.includes(prev.bank)
             return {
               ...prev,
               beneficiaryName: "",
               beneficiaryTelephone: isPhoneBased ? "+2340" + prev.accountNumber : ""
             }
           })
         }

        setIsLookingUp(false)
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      setFormData((prev) => ({ ...prev, beneficiaryName: "" }))
      setIsLookingUp(false)
      setLookupComplete(false)
    }
  }, [formData.accountNumber, toast])

  // Clear beneficiary telephone when bank changes to non-phone based
  useEffect(() => {
    if (!PHONE_BASED_WALLETS.includes(formData.bank)) {
      setFormData((prev) => ({ ...prev, beneficiaryTelephone: "" }))
    }
  }, [formData.bank])

  const handleContinue = () => {
    if (!formData.bank || !formData.accountNumber || !formData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!formData.beneficiaryName) {
      toast({
        title: "Beneficiary Name Required",
        description: "Please provide the beneficiary name",
        variant: "destructive",
      })
      return
    }

    if (PHONE_BASED_WALLETS.includes(formData.bank) && !formData.beneficiaryTelephone) {
      toast({
        title: "Beneficiary Telephone Required",
        description: "Please provide the beneficiary telephone number for SMS alert",
        variant: "destructive",
      })
      return
    }

    onContinue(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/20 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-40 left-5 w-24 h-24 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-lg animate-bounce"></div>

      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-xl px-4 py-4 flex items-center justify-between border-b border-gray-200/50 shadow-lg relative z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-blue-50/50 hover:scale-105 transition-all duration-200 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Transfer
        </h1>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-blue-50/50 hover:scale-105 transition-all duration-200 rounded-xl"
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-sm px-4 py-4 border-b border-gray-200/30">
        <div className="flex gap-2">
          {["New Beneficiary", "Saved Beneficiary"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              size="sm"
              className={`rounded-full px-6 font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#A4D233] to-[#8BC220] hover:from-[#8BC220] hover:to-[#7AB01F] text-black shadow-lg hover:shadow-xl hover:scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100/50"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "New Beneficiary" ? (
      <div className="px-4 py-6 space-y-6">
        {/* From Account with Enhanced Design */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <User className="h-4 w-4 text-[#004A9F]" />
            From account
          </label>
          <div className="bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl p-5 flex items-center justify-between border border-white/50 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">Savings account</div>
                <div className="text-xs text-gray-600 font-medium">{dataStore.getUserData().name}</div>
                <div className="text-xs text-gray-500">
                  Balance: ₦{formatCurrency(dataStore.getUserData().balance)}
                </div>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Bank Selection with Enhanced Design */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#004A9F]" />
            Bank
          </label>
          <Select value={formData.bank} onValueChange={(value) => setFormData({ ...formData, bank: value })}>
            <SelectTrigger className="bg-white/90 backdrop-blur-sm border-2 border-gray-200/50 focus:border-[#004A9F] rounded-xl h-14 hover:border-gray-300/70 transition-all duration-200">
              <SelectValue placeholder="Select bank" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-2xl">
              <div className="px-3 py-2 text-xs font-bold text-gray-500 bg-gradient-to-r from-blue-50 to-purple-50 sticky top-0">
                Traditional Banks
              </div>
              {NIGERIAN_BANKS.filter((bank) => bank.type === "bank").map((bank) => (
                <SelectItem key={`${bank.code}-${bank.type}-${bank.name}`} value={bank.name} className="hover:bg-blue-50/50 rounded-lg mx-1">
                  {bank.name}
                </SelectItem>
              ))}
              <div className="px-3 py-2 text-xs font-bold text-gray-500 bg-gradient-to-r from-purple-50 to-pink-50 sticky top-0 mt-2">
                Microfinance Banks
              </div>
              {NIGERIAN_BANKS.filter((bank) => bank.type === "microfinance").map((bank) => (
                <SelectItem key={`${bank.code}-${bank.type}-${bank.name}`} value={bank.name} className="hover:bg-purple-50/50 rounded-lg mx-1">
                  {bank.name}
                </SelectItem>
              ))}
              <div className="px-3 py-2 text-xs font-bold text-gray-500 bg-gradient-to-r from-green-50 to-blue-50 sticky top-0 mt-2">
                Digital Wallets & Payment Platforms
              </div>
              {NIGERIAN_BANKS.filter((bank) => bank.type === "wallet").map((bank) => (
                <SelectItem key={`${bank.code}-${bank.type}-${bank.name}`} value={bank.name} className="hover:bg-green-50/50 rounded-lg mx-1">
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Account Number with Enhanced Design */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#004A9F]" />
            Account Number
          </label>
          <Input
            placeholder="Enter account number"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            className="bg-white/90 backdrop-blur-sm border-2 border-gray-200/50 focus:border-[#004A9F] focus:ring-0 rounded-xl h-14 transition-all duration-200 hover:border-gray-300/70"
            maxLength={10}
          />
        </div>

        {/* Beneficiary Name with Enhanced Loading */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <User className="h-4 w-4 text-[#004A9F]" />
            Beneficiary Name
          </label>
          <div className="relative">
            <Input
              placeholder={isLookingUp ? "Looking up beneficiary..." : "Enter beneficiary name"}
              value={formData.beneficiaryName}
              onChange={(e) => setFormData({ ...formData, beneficiaryName: e.target.value })}
              className={`bg-white/90 backdrop-blur-sm border-2 border-gray-200/50 focus:border-[#004A9F] focus:ring-0 rounded-xl h-14 transition-all duration-200 hover:border-gray-300/70 ${
                lookupComplete ? "border-green-500 bg-green-50/50" : ""
              } ${isLookingUp ? "border-blue-500 bg-blue-50/50" : ""}`}
              disabled={isLookingUp}
            />
            {isLookingUp && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-[#004A9F]" />
                  <span className="text-xs text-[#004A9F] font-medium">Verifying...</span>
                </div>
              </div>
            )}
            {lookupComplete && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Beneficiary Telephone for Phone-based Wallets */}
        {PHONE_BASED_WALLETS.includes(formData.bank) && (
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#004A9F]" />
              Beneficiary Telephone (for SMS alert)
            </label>
            <Input
              placeholder="Enter beneficiary telephone number"
              value={formData.beneficiaryTelephone}
              onChange={(e) => setFormData({ ...formData, beneficiaryTelephone: e.target.value })}
              className="bg-white/90 backdrop-blur-sm border-2 border-gray-200/50 focus:border-[#004A9F] focus:ring-0 rounded-xl h-14 transition-all duration-200 hover:border-gray-300/70"
            />
          </div>
        )}

        {/* Amount with Enhanced Design */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#004A9F]" />
            Amount
          </label>
          <Input
            ref={amountInputRef}
            placeholder="Enter amount (e.g. 1000.00)"
            type="text"
            inputMode="decimal"
            pattern="\d+(\.\d{2})?"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') })}
            onBlur={() => {
              if (!formData.amount) return
              const n = Number(formData.amount)
              setFormData((prev) => ({ ...prev, amount: Number(n.toFixed(2)).toFixed(2) }))
            }}
            className="bg-white/90 backdrop-blur-sm border-2 border-gray-200/50 focus:border-[#004A9F] focus:ring-0 rounded-xl h-14 transition-all duration-200 hover:border-gray-300/70 text-lg font-semibold"
          />
        </div>

        {/* Remark with Enhanced Design */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#004A9F]" />
            Remark (optional)
          </label>
          <Input
            placeholder="Enter remark"
            value={formData.remark}
            onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
            className="bg-white/90 backdrop-blur-sm border-2 border-gray-200/50 focus:border-[#004A9F] focus:ring-0 rounded-xl h-14 transition-all duration-200 hover:border-gray-300/70"
          />
        </div>

        {/* Save as Beneficiary with Enhanced Design */}
        <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50">
          <Checkbox
            id="save-beneficiary"
            checked={formData.saveAsBeneficiary}
            onCheckedChange={(checked) => setFormData({ ...formData, saveAsBeneficiary: checked as boolean })}
            className="w-5 h-5 rounded-lg border-2 border-[#004A9F]/30 data-[state=checked]:bg-[#004A9F] data-[state=checked]:border-[#004A9F]"
          />
          <label
            htmlFor="save-beneficiary"
            className="text-sm font-semibold text-gray-700 flex items-center gap-2 cursor-pointer"
          >
            <Star className="h-4 w-4 text-[#004A9F]" />
            Save as beneficiary
          </label>
        </div>
        </div>
      ) : (
        // Saved Beneficiaries Tab
        <div className="px-4 py-6 pb-24">
          {savedBeneficiaries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <AlertCircle className="h-12 w-12 mx-auto opacity-50" />
              </div>
              <p className="text-gray-600 text-sm">No saved beneficiaries yet</p>
              <p className="text-gray-500 text-xs mt-1">Add a beneficiary to see them here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedBeneficiaries.map((beneficiary) => (
                <Button
                  key={beneficiary.id}
                  variant="ghost"
                  className="w-full h-auto p-4 justify-start bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm hover:from-blue-50/90 hover:to-blue-100/90 border border-white/50 hover:border-blue-200/50 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg"
                  onClick={() => handleSelectBeneficiary(beneficiary)}
                >
                  <div className="w-full text-left flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">{beneficiary.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{beneficiary.bank}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Enhanced Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
        <Button
          onClick={handleContinue}
          className="w-full h-14 bg-gradient-to-r from-[#004A9F] to-[#0072C6] hover:from-[#003875] hover:to-[#005A9F] text-white font-bold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
