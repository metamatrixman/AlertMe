"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Share } from "lucide-react"

interface TransactionSuccessProps {
  onNavigate: (screen: string, data?: any) => void
  transferData?: any
}

export function TransactionSuccess({ onNavigate, transferData }: TransactionSuccessProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Transaction details</h1>
        <Button variant="ghost" size="icon">
          <Share className="h-5 w-5" />
        </Button>
      </div>

      {/* Success Content */}
      <div className="px-4 py-12 text-center">
        <div className="w-20 h-20 bg-[#004A9F] rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold mb-4">Transfer Successful</h2>

        <div className="text-4xl font-bold mb-6">
          ₦ {transferData?.amount ? Number.parseFloat(transferData.amount).toLocaleString() : "0.00"}
        </div>

        <p className="text-sm text-gray-600 mb-12 max-w-sm mx-auto">
          The recipient account is expected to be credited within 5 minutes, subject to notification by the bank
        </p>

        {/* Buttons for navigation */}
        <div className="space-y-3">
          <Button
            className="w-full bg-[#004A9F] hover:bg-[#003875] text-white py-3 rounded-full"
            onClick={() => onNavigate("detailed-receipt", transferData?.id)}
          >
            View Detailed Receipt
          </Button>
          <Button
            variant="outline"
            className="w-full text-[#004A9F] border-[#004A9F] py-3 rounded-full hover:bg-blue-50 bg-transparent"
            onClick={() => onNavigate("dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
