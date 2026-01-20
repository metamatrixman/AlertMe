"use client"

import { memo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Share } from "@/components/ui/iconify-compat"
import { dataStore } from "@/lib/data-store"
import { formatCurrency } from "@/lib/form-utils"

interface TransactionSuccessProps {
  onNavigate: (screen: string, data?: any) => void
  transferData?: any
}

function TransactionSuccessComponent({ onNavigate, transferData }: TransactionSuccessProps) {
  useEffect(() => {
    if (transferData) {
      console.log("[v0] Transaction success notification added:", transferData)
      dataStore.addNotification({
        title: "Money Sent Successfully",
        message: `₦${formatCurrency(Number.parseFloat(transferData.amount || "0"))} sent to ${transferData.beneficiaryName || "Recipient"} in ${transferData.bank}`,
        type: "success",
      })
    }
  }, [transferData])

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
        <div className="w-20 h-20 bg-[#004A9F] rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <Check className="h-10 w-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold mb-4">Transfer Successful</h2>

        <div className="text-4xl font-bold mb-2">
          ₦ {transferData?.amount ? formatCurrency(Number.parseFloat(transferData.amount)) : "0.00"}
        </div>

        <div className="text-sm text-gray-600 mb-6">
          To: <span className="font-semibold text-gray-900">{transferData?.beneficiaryName || "Recipient"}</span>
        </div>

        <p className="text-sm text-gray-600 mb-12 max-w-sm mx-auto">
          The recipient account is expected to be credited within 5 minutes, subject to notification by the bank
        </p>

        {/* Transaction Details */}
        <div className="bg-white rounded-lg p-4 mb-6 text-left space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Bank:</span>
            <span className="font-semibold">{transferData?.bank}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Account:</span>
            <span className="font-semibold">{transferData?.accountNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Reference:</span>
            <span className="font-semibold">{transferData?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-semibold">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

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

export const TransactionSuccess = memo(TransactionSuccessComponent)
