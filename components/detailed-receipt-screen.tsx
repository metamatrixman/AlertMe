"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, Share2, Copy, Check } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import { formatCurrency } from "@/lib/form-utils"
import { useToast } from "@/hooks/use-toast"

interface DetailedReceiptScreenProps {
  onBack: () => void
  transferData: any
}

export function DetailedReceiptScreen({ onBack, transferData }: DetailedReceiptScreenProps) {
  const [receiptData, setReceiptData] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Generate detailed receipt data
    const userData = dataStore.getUserData()
    const currentDate = new Date()
    const receiptNumber = `RCP${Date.now()}`
    
    // Use fee from transfer data, or default to 30
    const transactionFee = transferData?.fee || 30.0

    setReceiptData({
      receiptNumber,
      transactionRef: `TXN${Date.now()}`,
      date: currentDate.toLocaleDateString(),
      time: currentDate.toLocaleTimeString(),
      amount: Number.parseFloat(transferData?.amount || "0"),
      fee: transactionFee,
      total: Number.parseFloat(transferData?.amount || "0") + transactionFee,
      sender: {
        name: userData.name,
        account: userData.accountNumber,
        bank: "Ecobank Nigeria",
      },
      recipient: {
        name: transferData?.beneficiaryName,
        account: transferData?.accountNumber,
        bank: transferData?.bank,
      },
      remark: transferData?.remark || "Transfer",
      status: "Successful",
      channel: "Ecobank Mobile App",
    })
  }, [transferData])

  const handleDownload = () => {
    // Simulate download
    toast({
      title: "Receipt Downloaded",
      description: "Receipt has been saved to your downloads",
    })
  }

  const handleShare = () => {
    // Simulate share
    toast({
      title: "Receipt Shared",
      description: "Receipt has been shared successfully",
    })
  }

  const copyReceiptNumber = () => {
    if (receiptData) {
      navigator.clipboard.writeText(receiptData.receiptNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied",
        description: "Receipt number copied to clipboard",
      })
    }
  }

  if (!receiptData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#004A9F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Generating receipt...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Transaction Receipt</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Receipt Card */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            {/* Header */}
            <div className="text-center mb-6 pb-4 border-b border-dashed">
              <div className="text-2xl font-bold text-[#004A9F] mb-2">Ecobank Nigeria</div>
              <div className="text-sm text-gray-600">The Pan African Bank</div>
              <div className="text-xs text-gray-500 mt-2">TRANSACTION RECEIPT</div>
            </div>

            {/* Receipt Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Receipt No:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{receiptData.receiptNumber}</span>
                  <Button variant="ghost" size="sm" onClick={copyReceiptNumber}>
                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Transaction Ref:</span>
                <span className="font-mono text-sm">{receiptData.transactionRef}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Date & Time:</span>
                <span className="text-sm">
                  {receiptData.date} {receiptData.time}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Channel:</span>
                <span className="text-sm">{receiptData.channel}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm text-green-600 font-medium">{receiptData.status}</span>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="border-t border-dashed pt-4 mb-6">
              <h3 className="font-semibold mb-4 text-center">TRANSACTION DETAILS</h3>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">FROM</div>
                  <div className="text-sm font-medium">{receiptData.sender.name}</div>
                  <div className="text-xs text-gray-600">
                    {receiptData.sender.account} • {receiptData.sender.bank}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">TO</div>
                  <div className="text-sm font-medium">{receiptData.recipient.name}</div>
                  <div className="text-xs text-gray-600">
                    {receiptData.recipient.account} • {receiptData.recipient.bank}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">DESCRIPTION</div>
                  <div className="text-sm">{receiptData.remark}</div>
                </div>
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="border-t border-dashed pt-4 mb-6">
              <h3 className="font-semibold mb-4 text-center">AMOUNT BREAKDOWN</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Transfer Amount:</span>
                  <span className="text-sm">₦{formatCurrency(receiptData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Transaction Fee:</span>
                  <span className="text-sm">₦{receiptData.fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t pt-2">
                  <span>Total Debited:</span>
                  <span>₦{formatCurrency(receiptData.total)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-dashed pt-4 text-center">
              <div className="text-xs text-gray-500 mb-2">
                This is a computer generated receipt and does not require signature
              </div>
              <div className="text-xs text-gray-400">
                Generated on {receiptData.date} at {receiptData.time}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                For enquiries, call 0700-ECOBANK or visit www.ecobank.com
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button onClick={handleDownload} className="w-full bg-[#004A9F] hover:bg-[#003875] text-white py-3">
            <Download className="h-4 w-4 mr-2" />
            Download PDF Receipt
          </Button>

          <Button onClick={handleShare} variant="outline" className="w-full py-3 bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            Share Receipt
          </Button>
        </div>
      </div>
    </div>
  )
}
