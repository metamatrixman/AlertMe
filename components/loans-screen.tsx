"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Calculator, Home } from "@/components/ui/iconify-compat"
import { formatCurrency } from "@/lib/form-utils"
import { dataStore } from "@/lib/data-store"
import { remoteSystem } from "@/lib/remote-system"

interface LoansScreenProps {
  onBack: () => void
  onNavigate: (screen: string) => void
}

export function LoansScreen({ onBack, onNavigate }: LoansScreenProps) {
  const [loanAmount, setLoanAmount] = useState("")
  const [loanTerm, setLoanTerm] = useState("")
  const [selectedLoanType, setSelectedLoanType] = useState("")

  const loanTypes = [
    {
      id: "quick",
      name: "Quick Loan",
      rate: "2.5%",
      maxAmount: 500000,
      term: "1-6 months",
      description: "Instant loan approval within minutes",
    },
    {
      id: "personal",
      name: "Personal Loan",
      rate: "18%",
      maxAmount: 2000000,
      term: "6-36 months",
      description: "Flexible personal financing solution",
    },
    {
      id: "business",
      name: "Business Loan",
      rate: "15%",
      maxAmount: 10000000,
      term: "12-60 months",
      description: "Grow your business with our financing",
    },
  ]

  const activeLoans = [
    {
      id: "1",
      type: "Quick Loan",
      amount: 150000,
      balance: 75000,
      dueDate: "2023-06-15",
      status: "active",
    },
  ]

  const calculateMonthlyPayment = () => {
    const principal = Number.parseFloat(loanAmount)
    const months = Number.parseInt(loanTerm)
    const rate = 0.025 // 2.5% monthly for quick loan

    if (principal && months && rate) {
      const monthlyPayment = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      return monthlyPayment.toFixed(2)
    }
    return "0.00"
  }

  const handleApplyLoan = () => {
    if (!selectedLoanType || !loanAmount || !loanTerm) {
      console.warn("[Loans] Incomplete loan application form")
      return
    }

    const selectedLoan = loanTypes.find((loan) => loan.id === selectedLoanType)
    if (!selectedLoan) {
      console.warn("[Loans] Selected loan type not found")
      return
    }

    try {
      // Add the loan application to DataStore
      const applicationId = dataStore.addLoanApplication({
        type: selectedLoan.name,
        amount: Number.parseFloat(loanAmount),
        term: Number.parseInt(loanTerm),
        purpose: "User loan request",
        status: "Submitted",
        monthlyPayment: Number.parseFloat(calculateMonthlyPayment()),
        interestRate: Number.parseFloat(selectedLoan.rate.replace("%", "")),
        totalRepayment: Number.parseFloat(calculateMonthlyPayment()) * Number.parseInt(loanTerm),
      })

      console.log("[Loans] Loan application submitted with ID:", applicationId)

      // Verify that remoteSystem pushes the update to the server
      if (remoteSystem.isConnected()) {
        remoteSystem.pushUpdate({
          type: "LOAN_APPLICATION_SUBMITTED",
          loanApplicationId: applicationId,
          loanData: {
            type: selectedLoan.name,
            amount: Number.parseFloat(loanAmount),
            term: Number.parseInt(loanTerm),
          },
          timestamp: new Date().toISOString(),
        })
        console.log("[Loans] Loan application update pushed to remote server")
      } else {
        console.warn("[Loans] RemoteSystem not connected, update will be synced on reconnection")
      }

      // Reset form
      setLoanAmount("")
      setLoanTerm("")
      setSelectedLoanType("")
    } catch (error) {
      console.error("[Loans] Error submitting loan application:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Loans</h1>
        <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
          <Home className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Active Loans */}
        {activeLoans.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Active Loans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeLoans.map((loan) => (
                <div key={loan.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{loan.type}</div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Original Amount</div>
                      <div className="font-medium">₦{formatCurrency(loan.amount)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Balance</div>
                      <div className="font-medium text-red-600">₦{formatCurrency(loan.balance)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Due Date</div>
                      <div className="font-medium">{new Date(loan.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Progress</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#A4D233] h-2 rounded-full"
                          style={{ width: `${((loan.amount - loan.balance) / loan.amount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Loan Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Loan Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="loan-amount">Loan Amount (₦)</Label>
              <Input
                id="loan-amount"
                inputMode="numeric"
                step="0.01"
                placeholder="Enter loan amount (e.g. 1000.00)"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}
                onBlur={() => {
                  if (!loanAmount) return
                  const n = Number(loanAmount)
                  setLoanAmount(Number(n.toFixed(2)).toFixed(2))
                }}
              />
            </div>

            <div>
              <Label htmlFor="loan-term">Loan Term (months)</Label>
              <Select value={loanTerm} onValueChange={setLoanTerm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 month</SelectItem>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loanAmount && loanTerm && (
              <div className="bg-[#004A9F] text-white p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-sm opacity-80">Estimated Monthly Payment</div>
                  <div className="text-2xl font-bold">₦{calculateMonthlyPayment()}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Loan Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Available Loan Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loanTypes.map((loan) => (
              <div
                key={loan.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedLoanType === loan.id ? "border-[#004A9F] bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedLoanType(loan.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{loan.name}</div>
                  <Badge className="bg-[#A4D233] text-black">{loan.rate} monthly</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-3">{loan.description}</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Max Amount</div>
                    <div className="font-medium">₦{formatCurrency(loan.maxAmount)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Term</div>
                    <div className="font-medium">{loan.term}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Apply Button */}
        <Button 
          className="w-full bg-[#004A9F] hover:bg-[#003875] text-white py-3" 
          disabled={!selectedLoanType}
          onClick={handleApplyLoan}
        >
          Apply for Loan
        </Button>
      </div>
    </div>
  )
}
