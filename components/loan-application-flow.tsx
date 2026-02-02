"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Home,
  CheckCircle2,
  AlertCircle,
  Upload,
  User,
  FileText,
  Phone,
  Camera,
  ChevronRight,
  ChevronLeft,
} from "@/components/ui/iconify-compat"
import { formatCurrency } from "@/lib/form-utils"
import { dataStore, type LoanApplication } from "@/lib/data-store"

interface LoanApplicationFlowProps {
  onBack: () => void
  onNavigate: (screen: string) => void
  application?: LoanApplication
}

interface FormStep {
  id: string
  title: string
  description: string
  completed: boolean
  data?: any
}

export function LoanApplicationFlow({ onBack, onNavigate, application }: LoanApplicationFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<"form" | "processing" | "complete">("form")

  // Form state for KYC & User Input
  const [phoneNumber, setPhoneNumber] = useState("")
  const [bvn, setBvn] = useState("")
  const [nin, setNin] = useState("")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [idType, setIdType] = useState("nin")

  // Liveness check and device metadata
  const [livenessCheckDone, setLivenessCheckDone] = useState(false)
  const [dataPermissionGranted, setDataPermissionGranted] = useState(false)

  // Document uploads
  const [bankStatementFile, setBankStatementFile] = useState<File | null>(null)
  const [employmentLetterFile, setEmploymentLetterFile] = useState<File | null>(null)
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null)

  // Guarantor information
  const [guarantor1Name, setGuarantor1Name] = useState("")
  const [guarantor1Phone, setGuarantor1Phone] = useState("")
  const [guarantor2Name, setGuarantor2Name] = useState("")
  const [guarantor2Phone, setGuarantor2Phone] = useState("")

  // Loan request details
  const [requestedAmount, setRequestedAmount] = useState("")
  const [loanPurpose, setLoanPurpose] = useState("")

  const steps: FormStep[] = [
    {
      id: "identity",
      title: "Identity Verification",
      description: "Verify your identity with phone number and BVN/NIN",
      completed: !!phoneNumber && (!!bvn || !!nin),
    },
    {
      id: "security",
      title: "Security Setup",
      description: "Set up your 4-digit PIN for secure transactions",
      completed: pin.length === 4 && pin === confirmPin,
    },
    {
      id: "liveness",
      title: "Liveness Check",
      description: "Take a selfie to verify your identity",
      completed: livenessCheckDone,
    },
    {
      id: "permissions",
      title: "Data Permissions",
      description: "Grant permission to analyze transaction patterns",
      completed: dataPermissionGranted,
    },
    {
      id: "documents",
      title: "Document Upload",
      description: "Upload required financial documents",
      completed: !!bankStatementFile && !!employmentLetterFile && !!idDocumentFile,
    },
    {
      id: "guarantors",
      title: "Guarantor Details",
      description: "Provide information for 2 guarantors",
      completed: !!guarantor1Name && !!guarantor1Phone && !!guarantor2Name && !!guarantor2Phone,
    },
    {
      id: "loan-request",
      title: "Loan Request",
      description: "Specify your loan amount and purpose",
      completed: !!requestedAmount && !!loanPurpose,
    },
    {
      id: "review",
      title: "Review & Submit",
      description: "Review your application and submit for processing",
      completed: false,
    },
  ]

  const completedSteps = steps.filter((s) => s.completed).length
  const progressPercentage = (completedSteps / steps.length) * 100

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File) => void) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
    }
  }

  const handleNextStep = async () => {
    if (currentStep === steps.length - 1) {
      // Submit application
      await submitApplication()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitApplication = async () => {
    setIsProcessing(true)
    setApplicationStatus("processing")

    try {
      // Simulate AI underwriting process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Create loan application
      const principal = Number.parseFloat(requestedAmount)
      const monthlyRate = 0.025 / 12 // 2.5% monthly for quick loan
      const months = 6

      const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)

      dataStore.addLoanApplication({
        type: "Quick Loan (AI Underwritten)",
        amount: principal,
        term: months,
        purpose: loanPurpose,
        status: "Under Review",
        monthlyPayment: monthlyPayment,
        interestRate: 2.5,
        totalRepayment: monthlyPayment * months,
        uploadedDocuments: {
          bankStatement: !!bankStatementFile,
          employmentLetter: !!employmentLetterFile,
          idVerification: !!idDocumentFile,
          guarantors: true,
          loanDeposit: false,
        },
      })

      // Simulate AI credit score determination
      const creditScore = Math.floor(Math.random() * 300) + 400 // 400-700 range
      const loanOffer = calculateLoanOffer(creditScore, principal)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      setApplicationStatus("complete")
    } catch (error) {
      console.error("[Loan Application] Error submitting application:", error)
      setApplicationStatus("form")
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateLoanOffer = (creditScore: number, requested: number) => {
    // Ladder system based on credit score
    const multipliers: { [key: string]: number } = {
      excellent: 1.5,
      good: 1.2,
      fair: 0.8,
      poor: 0.5,
    }

    let creditTier = "poor"
    if (creditScore >= 600) creditTier = "excellent"
    else if (creditScore >= 550) creditTier = "good"
    else if (creditScore >= 500) creditTier = "fair"

    return {
      score: creditScore,
      tier: creditTier,
      approvedAmount: requested * multipliers[creditTier],
      interestRate: creditScore >= 600 ? 2.5 : 5.0,
    }
  }

  // Render current step content
  const renderStepContent = () => {
    const step = steps[currentStep]

    switch (step.id) {
      case "identity":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+234 801 234 5678"
              />
            </div>

            <div>
              <Label>ID Type</Label>
              <Select value={idType} onValueChange={setIdType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bvn">BVN (Bank Verification Number)</SelectItem>
                  <SelectItem value="nin">NIN (National Identification Number)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {idType === "bvn" ? (
              <div>
                <Label htmlFor="bvn">BVN</Label>
                <Input
                  id="bvn"
                  value={bvn}
                  onChange={(e) => setBvn(e.target.value.slice(0, 11))}
                  placeholder="Enter your 11-digit BVN"
                  maxLength={11}
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="nin">NIN</Label>
                <Input
                  id="nin"
                  value={nin}
                  onChange={(e) => setNin(e.target.value.slice(0, 11))}
                  placeholder="Enter your 11-digit NIN"
                  maxLength={11}
                />
              </div>
            )}

            <div className="bg-blue-50 border-l-4 border-[#004A9F] p-3 rounded">
              <p className="text-xs text-[#004A9F]">
                Your identity information is encrypted and securely stored to prevent unauthorized access.
              </p>
            </div>
          </div>
        )

      case "security":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pin">Create 4-Digit PIN</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value.slice(0, 4))}
                placeholder="●●●●"
                maxLength={4}
              />
              <p className="text-xs text-gray-500 mt-1">Use numbers only</p>
            </div>

            <div>
              <Label htmlFor="confirm-pin">Confirm PIN</Label>
              <Input
                id="confirm-pin"
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.slice(0, 4))}
                placeholder="●●●●"
                maxLength={4}
              />
            </div>

            {pin && confirmPin && pin !== confirmPin && (
              <div className="flex gap-2 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-700">PINs do not match</p>
              </div>
            )}

            {pin && confirmPin && pin === confirmPin && (
              <div className="flex gap-2 bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-700">PIN confirmed</p>
              </div>
            )}
          </div>
        )

      case "liveness":
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              {livenessCheckDone ? (
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-700">Selfie captured successfully</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click below to take selfie</p>
                </div>
              )}
            </div>

            <Button
              onClick={() => {
                // Simulate selfie capture
                setTimeout(() => setLivenessCheckDone(true), 1500)
              }}
              disabled={livenessCheckDone}
              className="w-full bg-[#004A9F] hover:bg-[#003875] text-white"
            >
              <Camera className="h-4 w-4 mr-2" />
              {livenessCheckDone ? "Selfie Captured" : "Take Selfie"}
            </Button>

            <div className="bg-blue-50 border-l-4 border-[#004A9F] p-3 rounded">
              <p className="text-xs text-[#004A9F]">
                A liveness check confirms you are the account holder and prevents identity fraud.
              </p>
            </div>
          </div>
        )

      case "permissions":
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-3">Data Permission Required</p>
              <p className="text-xs text-yellow-800 mb-4">
                To provide you with the best loan offer, we analyze:
              </p>
              <ul className="text-xs text-yellow-800 space-y-2">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>SMS transaction alerts from your banks</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Call logs to verify communication patterns</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Contact lists for identity verification</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Device metadata for security profiling</span>
                </li>
              </ul>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="data-permission"
                checked={dataPermissionGranted}
                onCheckedChange={(checked) => setDataPermissionGranted(checked as boolean)}
              />
              <label htmlFor="data-permission" className="text-sm text-gray-700 cursor-pointer">
                I understand and grant permission for Branch to analyze my data for credit assessment
              </label>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
              <p className="text-xs text-green-700">
                Your data is encrypted and used only for credit assessment. You can revoke this permission anytime.
              </p>
            </div>
          </div>
        )

      case "documents":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2">3 Months Bank Statement</Label>
              <label className="flex items-center justify-center h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer transition-all">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, setBankStatementFile)}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                {bankStatementFile ? (
                  <div className="text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-green-700">{bankStatementFile.name}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Click to upload PDF or image</p>
                  </div>
                )}
              </label>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2">Employment Letter</Label>
              <label className="flex items-center justify-center h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer transition-all">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, setEmploymentLetterFile)}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                {employmentLetterFile ? (
                  <div className="text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-green-700">{employmentLetterFile.name}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Click to upload PDF or image</p>
                  </div>
                )}
              </label>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2">ID Document</Label>
              <label className="flex items-center justify-center h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer transition-all">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, setIdDocumentFile)}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                {idDocumentFile ? (
                  <div className="text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-green-700">{idDocumentFile.name}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Click to upload PDF or image</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        )

      case "guarantors":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-[#004A9F] p-3 rounded mb-4">
              <p className="text-xs text-[#004A9F]">
                Provide details of 2 guarantors who can vouch for your creditworthiness.
              </p>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Guarantor 1
              </Label>
              <Input
                value={guarantor1Name}
                onChange={(e) => setGuarantor1Name(e.target.value)}
                placeholder="Full name"
                className="mb-2"
              />
              <Input
                value={guarantor1Phone}
                onChange={(e) => setGuarantor1Phone(e.target.value)}
                placeholder="Phone number"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Guarantor 2
              </Label>
              <Input
                value={guarantor2Name}
                onChange={(e) => setGuarantor2Name(e.target.value)}
                placeholder="Full name"
                className="mb-2"
              />
              <Input
                value={guarantor2Phone}
                onChange={(e) => setGuarantor2Phone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>
        )

      case "loan-request":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Requested Loan Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                placeholder="e.g., 500,000"
                max={1000000}
              />
              <p className="text-xs text-gray-500 mt-1">Maximum: ₦1,000,000</p>
            </div>

            <div>
              <Label htmlFor="purpose">Purpose of Loan</Label>
              <Select value={loanPurpose} onValueChange={setLoanPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business Expansion</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="medical">Medical Emergency</SelectItem>
                  <SelectItem value="home">Home Improvement</SelectItem>
                  <SelectItem value="personal">Personal Use</SelectItem>
                  <SelectItem value="debt">Debt Consolidation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {requestedAmount && (
              <div className="bg-[#004A9F] text-white p-4 rounded-lg">
                <p className="text-xs opacity-80 mb-1">Estimated Monthly Payment</p>
                <p className="text-xl font-bold">₦{formatCurrency(Number(requestedAmount) / 6)}</p>
                <p className="text-xs opacity-80 mt-2">6-month term at 2.5% interest rate</p>
              </div>
            )}
          </div>
        )

      case "review":
        return (
          <div className="space-y-4">
            <Card className="border-2 border-[#004A9F] bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-[#004A9F] mb-3">Application Review</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Phone Number:</span>
                    <span className="font-medium">{phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID Type:</span>
                    <span className="font-medium">{idType === "bvn" ? `BVN: ${bvn}` : `NIN: ${nin}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PIN Set:</span>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Liveness Check:</span>
                    {livenessCheckDone ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-orange-500" />}
                  </div>
                  <div className="flex justify-between">
                    <span>Documents:</span>
                    <span className="font-medium">3/3 uploaded</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guarantors:</span>
                    <span className="font-medium">2/2 provided</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Requested Amount:</span>
                      <span>₦{formatCurrency(Number(requestedAmount))}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
              <p className="text-xs text-green-700">
                Your application is ready for submission. Our AI underwriting system will process it within minutes.
              </p>
            </div>

            <Checkbox id="agree-terms" />
            <label htmlFor="agree-terms" className="text-xs text-gray-700 ml-2">
              I agree to the terms and conditions and authorize Branch to process my application.
            </label>
          </div>
        )

      default:
        return null
    }
  }

  if (applicationStatus === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex flex-col items-center justify-center px-4 pb-24">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your loan application has been successfully submitted for AI underwriting. We'll notify you of our decision within 24 hours.
          </p>

          <div className="bg-white rounded-lg p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Requested Amount:</span>
              <span className="font-semibold">₦{formatCurrency(Number(requestedAmount))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status:</span>
              <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
            </div>
          </div>

          <Button onClick={() => onNavigate("loans")} className="w-full bg-[#004A9F] hover:bg-[#003875] text-white py-3">
            Back to Loans
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b shadow-sm sticky top-0 z-40">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Loan Application</h1>
        <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
          <Home className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Progress Indicator */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
              <Badge className="bg-[#A4D233] text-black">
                {Math.round(progressPercentage)}%
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-xs text-gray-500 mt-3">{steps[currentStep].description}</p>
          </CardContent>
        </Card>

        {/* Steps Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Application Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                disabled={currentStep === index}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                  index === currentStep
                    ? "border-[#004A9F] bg-blue-50"
                    : step.completed
                      ? "border-green-200 bg-green-50 cursor-pointer"
                      : "border-gray-200 bg-white cursor-pointer hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.completed
                      ? "bg-green-600 text-white"
                      : index === currentStep
                        ? "bg-[#004A9F] text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`font-medium text-sm ${step.completed ? "text-green-700 line-through" : ""}`}>
                    {step.title}
                  </span>
                </div>
                {step.completed && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <Card className="border-2 border-[#004A9F] shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#004A9F] to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-base">{steps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-40">
                <div className="w-12 h-12 border-4 border-[#004A9F] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-center text-sm text-gray-600">Processing your application...</p>
              </div>
            ) : (
              renderStepContent()
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
            variant="outline"
            className="flex-1 py-3"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={!steps[currentStep].completed || isProcessing}
            className="flex-1 py-3 bg-[#004A9F] hover:bg-[#003875] text-white"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Submit Application
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
