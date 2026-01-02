"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Filter, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { dataStore, type Transaction } from "@/lib/data-store"
import { formatCurrency } from "@/lib/form-utils"

interface EnhancedTransactionHistoryProps {
  onBack: () => void
  onViewTransaction: (transactionId: string) => void
}

export function EnhancedTransactionHistory({ onBack, onViewTransaction }: EnhancedTransactionHistoryProps) {
  const [activeTab, setActiveTab] = useState("All")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const updateTransactions = () => {
      setTransactions(dataStore.getTransactions())
    }

    updateTransactions()
    const unsubscribe = dataStore.subscribe(updateTransactions)
    return unsubscribe
  }, [])

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Sent" && transaction.isDebit) ||
      (activeTab === "Received" && !transaction.isDebit)

    const matchesSearch =
      searchTerm === "" ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesTab && matchesSearch
  })

  const groupedTransactions = filteredTransactions.reduce(
    (acc, transaction) => {
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const transactionDate = new Date(transaction.date).toDateString()

      let section = "Earlier"
      if (transactionDate === today) section = "Today"
      else if (transactionDate === yesterday) section = "Yesterday"

      if (!acc[section]) {
        acc[section] = []
      }
      acc[section].push(transaction)
      return acc
    },
    {} as Record<string, Transaction[]>,
  )

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
          Transactions
        </h1>
        <div className="w-10"></div>
      </div>

      {/* Enhanced Filter Tabs */}
      <div className="bg-white/80 backdrop-blur-sm px-4 py-4 border-b border-gray-200/30">
        <div className="flex gap-2">
          {["All", "Sent", "Received"].map((tab) => (
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

      {/* Enhanced Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transaction"
            className="pl-12 pr-14 bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 focus:border-[#004A9F] focus:ring-0 rounded-xl h-12 transition-all duration-200 hover:border-gray-300/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-100/50 rounded-lg"
          >
            <Filter className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Enhanced Transaction List */}
      <div className="px-4 pb-20">
        {Object.entries(groupedTransactions).map(([section, sectionTransactions]) => (
          <div key={section} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-bold text-gray-800">{section}</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
              <Badge className="bg-gray-100 text-gray-600 font-medium">{sectionTransactions.length}</Badge>
            </div>
            <div className="space-y-3">
              {sectionTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl cursor-pointer hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-white/50 group animate-in slide-in-from-bottom-1"
                  onClick={() => onViewTransaction(transaction.id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
                        {transaction.isDebit ? (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div
                        className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                          transaction.isDebit
                            ? "bg-gradient-to-r from-red-400 to-red-600"
                            : "bg-gradient-to-r from-green-400 to-green-600"
                        } shadow-sm`}
                      ></div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-800 group-hover:text-[#004A9F] transition-colors">
                        {transaction.type}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {new Date(transaction.date).toLocaleDateString()} {transaction.time}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {transaction.recipient || transaction.sender} • {transaction.reference}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-base ${transaction.isDebit ? "text-red-500" : "text-green-500"}`}>
                      {transaction.isDebit ? "- " : "+ "}₦{formatCurrency(transaction.amount)}
                    </div>
                    <div
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        transaction.status === "Successful"
                          ? "text-green-700 bg-green-100"
                          : transaction.status === "Pending"
                            ? "text-orange-700 bg-orange-100"
                            : "text-red-700 bg-red-100"
                      }`}
                    >
                      {transaction.status}
                    </div>
                    {transaction.fee && <div className="text-xs text-gray-500 mt-1">Fee: ₦{formatCurrency(transaction.fee)}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-gray-500 mb-2 font-semibold">No transactions found</div>
            <div className="text-sm text-gray-400">
              {searchTerm ? "Try adjusting your search terms" : "Your transactions will appear here"}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
