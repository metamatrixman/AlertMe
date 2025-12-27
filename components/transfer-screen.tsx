"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronDown, Home } from "lucide-react"

interface TransferScreenProps {
  onBack: () => void
  onNavigate: (screen: string, data?: any) => void
  transferData?: any
}

function TransferScreenComponent({ onBack, onNavigate, transferData }: TransferScreenProps) {
  const handleContinue = () => {
    onNavigate("pin-confirmation", transferData)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Transfer</h1>
        <Button variant="ghost" size="icon">
          <Home className="h-5 w-5" />
        </Button>
      </div>

      {/* Transfer Details */}
      <div className="px-4 py-6 space-y-6">
        {/* From */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">From</label>
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">Savings account</div>
                <div className="text-xs text-gray-600">ADEFEMI JOHN OLAYEMI</div>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* To Beneficiary */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">To Beneficiary</label>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="font-medium text-sm mb-1">{transferData?.beneficiaryName || "Pedro Banabas"}</div>
            <div className="text-xs text-gray-600 mb-2">{transferData?.accountNumber || "0348483930"}</div>
            <div className="text-xs text-gray-500">{transferData?.bank || "Firstbank"}</div>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Amount</label>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-2xl font-bold">
              ₦ {transferData?.amount ? Number.parseFloat(transferData.amount).toLocaleString() : "0.00"}
            </div>
          </div>
          <div className="text-right mt-2">
            <span className="text-sm text-[#004A9F]">Transfer fees: ₦ 30.00</span>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          onClick={handleContinue}
          className="w-full bg-[#004A9F] hover:bg-[#003875] text-white py-3 rounded-full"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

export const TransferScreen = memo(TransferScreenComponent)
