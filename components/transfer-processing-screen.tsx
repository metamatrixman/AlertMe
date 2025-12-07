"use client"

import { useEffect, useState } from "react"
import { Loader2, CreditCard, Shield, CheckCircle } from "lucide-react"

interface TransferProcessingScreenProps {
  onNavigate: (screen: string, data?: any) => void
  transferData: any
}

export function TransferProcessingScreen({ onNavigate, transferData }: TransferProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    { icon: Shield, label: "Verifying PIN", description: "Authenticating your transaction" },
    { icon: CreditCard, label: "Processing Payment", description: "Debiting your account" },
    { icon: CheckCircle, label: "Sending Money", description: "Crediting recipient account" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            onNavigate("transaction-success", transferData)
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 100)

    // Update steps based on progress
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1 && progress > (prev + 1) * 33) {
          return prev + 1
        }
        return prev
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      clearInterval(stepTimer)
    }
  }, [onNavigate, progress, steps.length, transferData])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm mx-auto">
        {/* Main Loading Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div
              className="absolute inset-0 rounded-full border-4 border-[#004A9F] border-t-transparent animate-spin"
              style={{
                background: `conic-gradient(from 0deg, #004A9F ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`,
                borderRadius: "50%",
              }}
            ></div>
            <div className="absolute inset-4 bg-[#004A9F] rounded-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#004A9F] mb-2">{Math.round(progress)}%</div>
        </div>

        {/* Current Step */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index <= currentStep ? "bg-[#004A9F] text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 mx-2 ${index < currentStep ? "bg-[#004A9F]" : "bg-gray-200"}`}></div>
                  )}
                </div>
              )
            })}
          </div>

          <h2 className="text-xl font-semibold mb-2">{steps[currentStep].label}</h2>
          <p className="text-gray-600 text-sm">{steps[currentStep].description}</p>
        </div>

        {/* Transfer Details */}
        <div className="bg-white rounded-lg p-4 text-left">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-[#004A9F]">
              ₦ {Number.parseFloat(transferData?.amount || "0").toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">to {transferData?.beneficiaryName}</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Bank:</span>
              <span className="font-medium">{transferData?.bank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account:</span>
              <span className="font-medium">{transferData?.accountNumber}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">Please do not close this page while processing...</div>
      </div>
    </div>
  )
}
