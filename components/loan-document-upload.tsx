"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Home, Upload, CheckCircle2, ChevronRight, ChevronLeft } from "@/components/ui/iconify-compat"
import { formatCurrency } from "@/lib/form-utils"
import type { LoanApplication } from "@/lib/data-store"

interface LoanDocumentUploadProps {
  onBack: () => void
  application: LoanApplication
}

interface DocumentRequirement {
  id: number
  title: string
  description: string
  completed: boolean
  fileName?: string
}

export function LoanDocumentUpload({ onBack, application }: LoanDocumentUploadProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [documents, setDocuments] = useState<DocumentRequirement[]>([
    {
      id: 1,
      title: "3 Months Bank Statement",
      description: "Latest bank statements showing account activity",
      completed: false,
    },
    {
      id: 2,
      title: "Employment Letter",
      description: "Official letter from employer confirming employment",
      completed: false,
    },
    {
      id: 3,
      title: "2 Guarantors",
      description: "Provide details of 2 guarantors with valid contact information",
      completed: false,
    },
    {
      id: 4,
      title: "Valid ID Verification",
      description: "NIN or International Passport verification",
      completed: false,
    },
    {
      id: 5,
      title: "2.15% Loan Deposit",
      description: `Initial deposit of 2.15% of requested loan amount`,
      completed: false,
    },
  ])

  const completedCount = documents.filter((doc) => doc.completed).length
  const loanDepositAmount = application.amount * 0.0215

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate file upload processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update the document as completed
    setDocuments((prev) =>
      prev.map((doc, index) => (index === currentStep ? { ...doc, completed: true, fileName: file.name } : doc)),
    )

    setIsUploading(false)

    // Move to next step if available
    if (currentStep < documents.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (currentStep < documents.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  const currentDocument = documents[currentStep]

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b shadow-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Upload Documents</h1>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <Home className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Application Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-gray-900">{application.type}</div>
              <Badge className={`${
                application.status === "Approved"
                  ? "bg-green-100 text-green-800"
                  : application.status === "Rejected"
                    ? "bg-red-100 text-red-800"
                    : application.status === "Under Review"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
              }`}>
                {application.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mt-3">
              <div>
                <div className="text-gray-600 text-xs">Loan Amount</div>
                <div className="font-medium">₦{formatCurrency(application.amount)}</div>
              </div>
              <div>
                <div className="text-gray-600 text-xs">2.15% Deposit Due</div>
                <div className="font-medium text-orange-600">₦{formatCurrency(loanDepositAmount)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Document Upload Progress</span>
              <Badge className="bg-[#A4D233] text-black">
                {completedCount}/{documents.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <button
                  key={doc.id}
                  onClick={() => goToStep(index)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                    index === currentStep
                      ? "border-[#004A9F] bg-blue-50"
                      : doc.completed
                        ? "border-green-200 bg-green-50 cursor-pointer"
                        : "border-gray-200 bg-white cursor-pointer hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      doc.completed
                        ? "bg-green-600 text-white"
                        : index === currentStep
                          ? "bg-[#004A9F] text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}>
                      {doc.completed ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${doc.completed ? "text-green-700 line-through" : "text-gray-900"}`}>
                        {doc.title}
                      </div>
                      {doc.fileName && <div className="text-xs text-gray-500 mt-1">✓ {doc.fileName}</div>}
                    </div>
                  </div>
                  {doc.completed && !isUploading && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Upload Area */}
        <Card className="border-2 border-[#004A9F] shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#004A9F] to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-base">Step {currentStep + 1} of {documents.length}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Document Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">{currentDocument.title}</h3>
              <p className="text-sm text-gray-600">{currentDocument.description}</p>

              {currentStep === 4 && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                  <p className="text-xs text-orange-900">
                    <span className="font-semibold">Deposit Amount Required:</span> ₦{formatCurrency(loanDepositAmount)}
                  </p>
                </div>
              )}
            </div>

            {/* Upload Area */}
            {currentDocument.completed ? (
              <div className="flex items-center justify-center h-32 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-700">Document uploaded successfully</p>
                  <p className="text-xs text-green-600 mt-1">{currentDocument.fileName}</p>
                </div>
              </div>
            ) : (
              <label className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 hover:border-[#004A9F] transition-all cursor-pointer group">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />
                <div className="text-center">
                  {isUploading ? (
                    <>
                      <div className="w-8 h-8 border-3 border-[#004A9F] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm font-medium text-gray-700">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2 group-hover:text-[#004A9F]" />
                      <p className="text-sm font-medium text-gray-700 group-hover:text-[#004A9F]">
                        Click to upload
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF, images or documents (Max 5MB)</p>
                    </>
                  )}
                </div>
              </label>
            )}

            {/* Document Guidelines */}
            <div className="bg-blue-50 border-l-4 border-[#004A9F] p-4 rounded">
              <p className="text-xs font-semibold text-[#004A9F] mb-2">Document Guidelines:</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Document must be clear and legible</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Accepted formats: PDF, JPG, PNG, DOC, DOCX</li>
                <li>• Ensure all text is readable and not blurry</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="flex-1 py-3"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === documents.length - 1}
            className="flex-1 py-3 bg-[#004A9F] hover:bg-[#003875] text-white"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Summary Section */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-base text-green-900">Upload Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-green-900">
            <div className="flex items-center justify-between">
              <span>Documents Completed:</span>
              <Badge className="bg-green-600 text-white">
                {completedCount}/{documents.length}
              </Badge>
            </div>
            {completedCount === documents.length && (
              <div className="pt-2 border-t border-green-200">
                <p className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  All documents uploaded successfully!
                </p>
                <p className="text-xs mt-2">Your application is ready for review.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
