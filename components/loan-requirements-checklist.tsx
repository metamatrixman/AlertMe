"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, Home } from "@/components/ui/iconify-compat"
import { Progress } from "@/components/ui/progress"

interface LoanRequirementsChecklistProps {
  onBack: () => void
}

export function LoanRequirementsChecklist({ onBack }: LoanRequirementsChecklistProps) {
  const [checklist, setChecklist] = useState([
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
      title: "10% Loan Deposit",
      description: "Initial deposit of 10% of requested loan amount",
      completed: false,
    },
  ])

  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60) // 48 hours in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const toggleChecklist = (id: number) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const completedCount = checklist.filter((item) => item.completed).length
  const progressPercentage = (completedCount / checklist.length) * 100

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  const handleSubmit = () => {
    if (completedCount === checklist.length) {
      setIsSubmitted(true)
      setTimeout(() => {
        onBack()
      }, 3000)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">All Requirements Completed!</h2>
          <p className="text-gray-600 mb-4">
            Your loan application is ready for review. We'll contact you within 24 hours.
          </p>
          <Button onClick={onBack} className="bg-[#004A9F] hover:bg-[#003875]">
            Return to Loans
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b shadow-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Loan Requirements</h1>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <Home className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Countdown Timer */}
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-orange-600" />
              <div>
                <div className="text-sm text-gray-600">Time Remaining</div>
                <div className="text-2xl font-bold text-orange-600">
                  {hours}h {minutes}m {seconds}s
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Complete all requirements within 48 hours to proceed with your application
            </p>
          </CardContent>
        </Card>

        {/* Progress Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Completion Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {completedCount} of {checklist.length} completed
              </span>
              <Badge className="bg-[#A4D233] text-black">{Math.round(progressPercentage)}%</Badge>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Requirements Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Required Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  item.completed ? "border-green-200 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={() => toggleChecklist(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`item-${item.id}`}
                      className={`font-medium cursor-pointer ${item.completed ? "text-green-700 line-through" : "text-gray-900"}`}
                    >
                      {item.title}
                    </label>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  {item.completed && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-base text-yellow-900">Important Notes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-yellow-900">
            <p>• All documents must be clear and legible</p>
            <p>• Bank statements must be dated within the last 3 months</p>
            <p>• Employment letter must be on official company letterhead</p>
            <p>• Guarantors must have valid identification and proof of income</p>
            <p>• Processing takes 24-48 hours after submission</p>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={completedCount !== checklist.length}
          className={`w-full py-3 ${
            completedCount === checklist.length
              ? "bg-[#004A9F] hover:bg-[#003875] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {completedCount === checklist.length
            ? "Submit Application"
            : `Complete ${checklist.length - completedCount} More Items`}
        </Button>
      </div>
    </div>
  )
}
