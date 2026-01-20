"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share2, Download, Copy, Check } from "@/components/ui/iconify-compat"
import { useState } from "react"
import { dataStore } from "@/lib/data-store"
import { formatCurrency } from "@/lib/form-utils"

interface TransactionDetailScreenProps {
  transactionId: string
  onBack: () => void
}

export function TransactionDetailScreen({ transactionId, onBack }: TransactionDetailScreenProps) {
  const [copied, setCopied] = useState(false)
  const transaction = dataStore.getTransaction(transactionId)

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Transaction Not Found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    )
  }

  const copyReference = () => {
    navigator.clipboard.writeText(transaction.reference)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Successful":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Transaction Details</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Status Card */}
        <Card className="bg-white">
          <CardContent className="p-6 text-center">
            <div
              className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                transaction.status === "Successful"
                  ? "bg-green-500"
                  : transaction.status === "Pending"
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            >
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">{transaction.type}</h2>
            <div className="text-3xl font-bold mb-2">
              {transaction.isDebit ? "-" : "+"} ₦{formatCurrency(transaction.amount)}
            </div>
            <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
          </CardContent>
        </Card>

        {/* Transaction Information */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">Transaction Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Date</div>
                <div className="font-medium">{new Date(transaction.date).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Time</div>
                <div className="font-medium">{transaction.time}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Reference Number</div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{transaction.reference}</span>
                <Button variant="ghost" size="sm" onClick={copyReference}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Description</div>
              <div className="font-medium">{transaction.description}</div>
            </div>

            {transaction.fee && (
              <div>
                <div className="text-sm text-gray-600">Transaction Fee</div>
                <div className="font-medium">₦{transaction.fee.toFixed(2)}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recipient/Sender Information */}
        {(transaction.recipient || transaction.sender) && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">{transaction.isDebit ? "Recipient" : "Sender"} Information</h3>

              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-medium">{transaction.recipient || transaction.sender}</div>
              </div>

              {(transaction.recipientAccount || transaction.senderAccount) && (
                <div>
                  <div className="text-sm text-gray-600">Account Number</div>
                  <div className="font-medium">
                    {transaction.isDebit ? transaction.recipientAccount : transaction.senderAccount}
                  </div>
                </div>
              )}

              {(transaction.recipientBank || transaction.senderBank) && (
                <div>
                  <div className="text-sm text-gray-600">Bank</div>
                  <div className="font-medium">
                    {transaction.isDebit ? transaction.recipientBank : transaction.senderBank}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Account Information */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">Your Account Information</h3>

            <div>
              <div className="text-sm text-gray-600">Account Name</div>
              <div className="font-medium">{dataStore.getUserData().name}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Account Number</div>
              <div className="font-medium">{dataStore.getUserData().accountNumber}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Bank</div>
              <div className="font-medium">Ecobank Nigeria</div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-[#004A9F] hover:bg-[#003875] text-white py-3">Download Receipt</Button>
          <Button variant="outline" className="w-full py-3 bg-transparent">
            Share Transaction
          </Button>
          {transaction.recipient && (
            <Button variant="outline" className="w-full py-3 bg-transparent">
              Send Money to {transaction.recipient} Again
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
