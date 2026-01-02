"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Share2, Download, Home, Copy, Sparkles, Receipt, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { dataStore } from "@/lib/data-store"
import { formatCurrency } from "@/lib/form-utils"

interface EnhancedTransactionSuccessProps {
  onHome: () => void
  onViewReceipt: () => void
  transferData?: any
}

export function EnhancedTransactionSuccess({ onHome, onViewReceipt, transferData }: EnhancedTransactionSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(true)
  const { toast } = useToast()
  const userData = dataStore.getUserData()

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleShare = () => {
    toast({
      title: "Share Receipt",
      description: "Receipt shared successfully",
    })
  }

  const handleCopyReference = () => {
    const reference = `ECO${Date.now().toString().slice(-8)}`
    navigator.clipboard.writeText(reference)
    toast({
      title: "Reference Copied",
      description: "Transaction reference copied to clipboard",
    })
  }

  const transactionReference = `ECO${Date.now().toString().slice(-8)}`
  const currentTime = new Date().toLocaleString()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-blue-50/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-40 left-5 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-lg animate-bounce"></div>
      <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-md animate-pulse delay-1000"></div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="px-4 py-8 relative z-10">
        {/* Success Icon with Enhanced Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-pulse">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-green-400 rounded-full animate-ping opacity-20 mx-auto"></div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Transfer Successful!
          </h1>
          <p className="text-gray-600 text-lg font-medium">Your money has been sent successfully</p>
        </div>

        {/* Enhanced Transaction Details Card */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0 overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
          <CardContent className="p-6 space-y-6 relative">
            {/* Amount Section */}
            <div className="text-center py-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50">
              <div className="text-4xl font-bold text-green-600 mb-2">
                ₦{transferData ? formatCurrency(Number.parseFloat(transferData.amount)) : "50,000.00"}
              </div>
              <div className="text-sm text-gray-600 font-medium">Amount Transferred</div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                <span className="text-sm text-gray-600 font-medium">To</span>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">{transferData?.beneficiaryName || "John Doe"}</div>
                  <div className="text-xs text-gray-500">
                    {transferData?.bank || "First Bank"} • {transferData?.accountNumber || "1234567890"}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                <span className="text-sm text-gray-600 font-medium">From</span>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">{userData.name}</div>
                  <div className="text-xs text-gray-500">Ecobank • {userData.accountNumber}</div>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Reference
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-gray-800">{transactionReference}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-gray-100 rounded-lg"
                    onClick={handleCopyReference}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                <span className="text-sm text-gray-600 font-medium">Transfer Fee</span>
                <span className="font-semibold text-gray-800">₦30.00</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Date & Time
                </span>
                <span className="font-semibold text-gray-800 text-sm">{currentTime}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-green-700">Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={handleShare}
              className="h-14 bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 hover:bg-blue-50 hover:border-blue-300 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              onClick={onViewReceipt}
              className="h-14 bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 hover:bg-green-50 hover:border-green-300 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Receipt
            </Button>
          </div>

          <Button
            onClick={onHome}
            className="w-full h-14 bg-gradient-to-r from-[#004A9F] to-[#0072C6] hover:from-[#003875] hover:to-[#005A9F] text-white font-bold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Enhanced Success Message */}
        <div className="text-center mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50">
          <div className="text-sm text-gray-600 mb-2 font-medium">🎉 Transaction completed successfully!</div>
          <div className="text-xs text-gray-500">Your recipient will be notified shortly</div>
        </div>
      </div>
    </div>
  )
}
