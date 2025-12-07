"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowLeftRight, Building2, Globe, CreditCard, Smartphone, Calendar, Send } from "lucide-react"

interface TransferOptionsProps {
  onBack: () => void
  onNavigate: (screen: string) => void
}

export function TransferOptions({ onBack, onNavigate }: TransferOptionsProps) {
  const transferOptions = [
    {
      id: "ecobank-domestic",
      title: "Ecobank Domestic",
      icon: ArrowLeftRight,
      color: "text-[#004A9F]",
      screen: "new-beneficiary",
    },
    {
      id: "other-banks",
      title: "Other local banks",
      icon: Building2,
      color: "text-[#004A9F]",
      screen: "new-beneficiary",
    },
    {
      id: "ecobank-africa",
      title: "Ecobank Africa",
      icon: Building2,
      color: "text-[#00B2A9]",
      screen: "new-beneficiary",
    },
    {
      id: "visa-direct",
      title: "Visa Direct",
      icon: CreditCard,
      color: "text-blue-600",
      screen: "new-beneficiary",
    },
    {
      id: "mobile-money",
      title: "Mobile money",
      icon: Smartphone,
      color: "text-[#00B2A9]",
      screen: "new-beneficiary",
    },
    {
      id: "standing-order",
      title: "Standing Order",
      icon: Calendar,
      color: "text-[#004A9F]",
      screen: "new-beneficiary",
    },
    {
      id: "international",
      title: "International Transfers",
      icon: Globe,
      color: "text-[#004A9F]",
      screen: "new-beneficiary",
    },
    {
      id: "email-sms",
      title: "Transfer by Email or SMS",
      icon: Send,
      color: "text-[#004A9F]",
      screen: "new-beneficiary",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#004A9F] text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" className="text-white" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Transfer</h1>
          <div className="w-10"></div>
        </div>

        {/* Tab Navigation */}
        <div className="flex">
          <Button className="bg-[#0072C6] text-white px-6 py-2 rounded-none border-b-2 border-white">Transfer</Button>
          <Button variant="ghost" className="text-white/70 px-6 py-2 rounded-none">
            Request
          </Button>
        </div>
      </div>

      {/* Transfer Options */}
      <div className="px-4 py-6">
        <div className="space-y-4">
          {transferOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <Button
                key={option.id}
                variant="ghost"
                className="w-full h-auto p-4 justify-between bg-white hover:bg-gray-50 border border-gray-100"
                onClick={() => onNavigate(option.screen)}
              >
                <div className="flex items-center gap-4">
                  <IconComponent className={`h-6 w-6 ${option.color}`} />
                  <span className="text-base font-medium text-gray-900">{option.title}</span>
                </div>
                <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
