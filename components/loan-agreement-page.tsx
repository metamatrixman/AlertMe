"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Home, CheckCircle2 } from "@/components/ui/iconify-compat"
import { dataStore } from "@/lib/data-store"
import { formatCurrency } from "@/lib/form-utils"

interface LoanAgreementPageProps {
  onBack: () => void
  loanApplicationId?: string
}

export function LoanAgreementPage({ onBack, loanApplicationId }: LoanAgreementPageProps) {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Get loan application details
  const applications = dataStore.getLoanApplications()
  const loanApp = loanApplicationId ? applications.find((app) => app.id === loanApplicationId) : applications[0]

  const userData = dataStore.getUserData()

  const agreementSections = [
    {
      id: "loan-terms",
      title: "Loan Terms & Conditions",
      content:
        `This Loan Agreement is entered into as of today between Ecobank Nigeria ("the Lender") and ${userData?.name} ("the Borrower"), with account number ${userData?.accountNumber}. The Borrower agrees to repay the borrowed amount of ${formatCurrency(loanApp?.amount || 0)} along with applicable interest rates as specified below. The loan shall be repaid in monthly installments as scheduled. Failure to make timely payments may result in penalties and legal action as permitted by applicable Nigerian banking regulations.`,
    },
    {
      id: "interest-rate",
      title: "Interest Rate & Fees",
      content: `The interest rate applicable to this loan is ${loanApp?.interestRate || 15}% per annum, calculated on a monthly basis. The monthly payment amount is ${formatCurrency(loanApp?.monthlyPayment || 0)}. Additional fees may apply for late payments (1% of outstanding balance) and loan origination fees (2% of loan amount). All fees are clearly stated in your loan schedule.`,
    },
    {
      id: "repayment",
      title: "Repayment Schedule",
      content: `The loan tenure is ${loanApp?.term || 12} months from the disbursement date. Monthly installments of ${formatCurrency(loanApp?.monthlyPayment || 0)} must be paid by the 5th of each month. The total amount to be repaid is ${formatCurrency(loanApp?.totalRepayment || 0)}. Payments must be made through the designated bank account or payment channels as specified by the Lender.`,
    },
    {
      id: "borrower-obligations",
      title: "Borrower Obligations",
      content:
        "The Borrower agrees to: (1) Use the loan amount only for the stated purpose; (2) Maintain a valid account with the Lender; (3) Notify the Lender of any change in contact information or employment; (4) Maintain adequate insurance if required; (5) Comply with all applicable laws and regulations.",
    },
    {
      id: "default-terms",
      title: "Default & Remedies",
      content:
        "If the Borrower fails to pay any installment within 15 days of the due date, the loan shall be considered in default. The Lender may: (1) Charge additional late fees; (2) Increase the interest rate by up to 2%; (3) Declare the entire outstanding balance immediately due and payable; (4) Take legal action to recover the amount.",
    },
    {
      id: "prepayment",
      title: "Prepayment & Closure",
      content:
        "The Borrower may prepay the entire loan or part of it without penalty. Upon prepayment, the interest will be calculated only on the remaining period. A loan closure certificate will be issued after the final payment is made. The closure certificate is required for future financial transactions.",
    },
    {
      id: "confidentiality",
      title: "Confidentiality & Data Protection",
      content:
        "All information provided by the Borrower will be kept confidential in accordance with data protection laws. The Lender may use this information for credit assessment and regulatory compliance. The Borrower's data will not be shared with third parties except as required by law or with explicit consent.",
    },
    {
      id: "governing-law",
      title: "Governing Law",
      content:
        "This agreement is governed by the laws of the jurisdiction in which the Lender is registered. Any dispute arising from this agreement shall be resolved through arbitration or court proceedings as per applicable laws.",
    },
  ]

  const handleAccept = async () => {
    if (!termsAccepted) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update loan application status
      if (loanApp) {
        dataStore.updateLoanApplication(loanApp.id, {
          ...loanApp,
          status: "Submitted",
        })
      }

      setIsSubmitted(true)
      setTimeout(() => {
        onBack()
      }, 3000)
    } catch (error) {
      console.error("Error accepting agreement:", error)
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Agreement Accepted</h2>
          <p className="text-gray-600 mb-2">Your loan agreement has been successfully accepted.</p>
          <p className="text-sm text-gray-500">Redirecting you back...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Loan Agreement</h1>
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go home"
          >
            <Home className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* User Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 overflow-hidden">
            {userData?.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {userData?.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">{userData?.name}</h2>
          <p className="text-sm text-gray-500">{userData?.email}</p>
        </div>

        {/* Borrower Information Card */}
        <Card className="mb-8 border-gray-200 shadow-sm bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-900">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs font-bold">
                ℹ
              </span>
              Borrower Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Borrower Name</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{userData?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Account Number</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{userData?.accountNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Phone Number</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{userData?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{userData?.email || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Summary Card */}
        <Card className="mb-8 border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-gray-900">Loan Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Loan Amount</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatCurrency(loanApp?.amount || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duration</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{loanApp?.term || 12} months</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Interest Rate</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{loanApp?.interestRate || 15}% p.a.</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Monthly Payment</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatCurrency(loanApp?.monthlyPayment || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Purpose</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{loanApp?.purpose || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Loan Type</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{loanApp?.type || "N/A"}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Total Repayment Amount</span>
                <span className="text-2xl font-bold text-[#004A9F]">
                  {formatCurrency(loanApp?.totalRepayment || 0)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This includes principal amount of {formatCurrency(loanApp?.amount || 0)} plus interest
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms & Conditions Sections */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
            Terms & Conditions
          </h3>
          <div className="space-y-3">
            {agreementSections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSection(expandedSection === section.id ? null : section.id)
                  }
                  className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <h4 className="text-sm font-medium text-gray-900">{section.title}</h4>
                  <span className={`text-gray-500 transition-transform ${
                    expandedSection === section.id ? "rotate-180" : ""
                  }`}>
                    ▼
                  </span>
                </button>
                {expandedSection === section.id && (
                  <div className="px-4 py-4 bg-white border-t border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Acceptance Section */}
        <Card className="border-gray-200 shadow-sm mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="accept-terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  className="mt-1"
                />
                <label
                  htmlFor="accept-terms"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                >
                  I have read and understood all the terms and conditions of this loan agreement. I agree to
                  repay the loan according to the specified schedule and accept all associated fees and
                  penalties as stated above.
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Important:</span> By accepting this agreement, you enter into
                  a legally binding contract. Ensure you have reviewed all terms carefully before proceeding.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!termsAccepted || isSubmitting}
            className="flex-1 bg-[#004A9F] hover:bg-[#003875] text-white disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Accept & Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}
