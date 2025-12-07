"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShareDetailsModal } from "@/components/share-details-modal"
import { NetworkChatModal } from "@/components/network-chat-modal"
import { BankServiceStatus } from "@/components/bank-service-status"
import { AddFundsModal } from "@/components/add-funds-modal"
import {
  ArrowLeft,
  Plus,
  Share2,
  Activity,
  ArrowDownToLine,
  PiggyBank,
  Network,
  Users,
  MessageSquare,
  CreditCard,
  Receipt,
  Palette,
  User,
  Wifi,
  HelpCircle,
  Github,
  FileText,
} from "lucide-react"

interface SettingsScreenProps {
  onNavigate: (screen: string) => void
  onBack: () => void
}

export function SettingsScreen({ onNavigate, onBack }: SettingsScreenProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const [showServiceStatus, setShowServiceStatus] = useState(false)
  const [showAddFunds, setShowAddFunds] = useState(false)

  // Mock user statistics
  const userStats = {
    balance: "₦ 150,000.20",
    beneficiaries: 12,
    recentTransactions: 8,
  }

  const quickActions = [
    {
      icon: Plus,
      label: "Add Funds",
      color: "bg-green-500",
      onClick: () => setShowAddFunds(true),
    },
    {
      icon: Share2,
      label: "Share Details",
      color: "bg-blue-500",
      onClick: () => setShowShareModal(true),
    },
    {
      icon: Activity,
      label: "Service Status",
      color: "bg-orange-500",
      onClick: () => setShowServiceStatus(true),
    },
    {
      icon: ArrowDownToLine,
      label: "Request Funds",
      color: "bg-purple-500",
      onClick: () => onNavigate("transfer-options"),
    },
    {
      icon: PiggyBank,
      label: "Savings",
      color: "bg-pink-500",
      onClick: () => console.log("Savings feature coming soon"),
    },
    {
      icon: Network,
      label: "Network",
      color: "bg-indigo-500",
      onClick: () => setShowNetworkModal(true),
    },
  ]

  const navigationItems = [
    {
      icon: Users,
      label: "Beneficiary Management",
      description: "Manage payment recipients",
      onClick: () => onNavigate("beneficiaries"),
    },
    {
      icon: MessageSquare,
      label: "SMS Templates",
      description: "Customize transaction alerts",
      onClick: () => onNavigate("sms-templates"),
    },
    {
      icon: CreditCard,
      label: "Business Card",
      description: "Share contact information",
      onClick: () => console.log("Business card feature coming soon"),
    },
    {
      icon: Receipt,
      label: "Receipt Generator",
      description: "Create and manage receipts",
      onClick: () => onNavigate("receipt-generator"),
    },
    {
      icon: User,
      label: "User Profile",
      description: "Manage account settings",
      onClick: () => onNavigate("profile"),
    },
    {
      icon: Palette,
      label: "Theme Settings",
      description: "Customize app appearance",
      onClick: () => onNavigate("themes"),
    },
  ]

  const systemItems = [
    {
      icon: Wifi,
      label: "Offline Mode",
      description: "Enable offline functionality",
      onClick: () => console.log("Offline mode coming soon"),
    },
    {
      icon: HelpCircle,
      label: "Support",
      description: "Get help and documentation",
      onClick: () => console.log("Support feature coming soon"),
    },
    {
      icon: Github,
      label: "GitHub",
      description: "View source code",
      onClick: () => window.open("https://github.com/aidigitalcashout-cell/v0-ecobank", "_blank"),
    },
    {
      icon: FileText,
      label: "Documentation",
      description: "User guide and API docs",
      onClick: () => console.log("Documentation coming soon"),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Settings</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-lg font-bold text-[#004A9F]">{userStats.balance}</div>
              <div className="text-xs text-gray-600">Current Balance</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-lg font-bold text-[#00B2A9]">{userStats.beneficiaries}</div>
              <div className="text-xs text-gray-600">Beneficiaries</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-lg font-bold text-[#A4D233]">{userStats.recentTransactions}</div>
              <div className="text-xs text-gray-600">Recent Transactions</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col gap-2 border-gray-200 bg-transparent"
                    onClick={action.onClick}
                  >
                    <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs text-center">{action.label}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Settings Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settings Navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-4 text-left"
                  onClick={item.onClick}
                >
                  <IconComponent className="h-5 w-5 mr-3 text-[#004A9F]" />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* System & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System & Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {systemItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-4 text-left"
                  onClick={item.onClick}
                >
                  <IconComponent className="h-5 w-5 mr-3 text-[#004A9F]" />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
                </Button>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ShareDetailsModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
      <NetworkChatModal isOpen={showNetworkModal} onClose={() => setShowNetworkModal(false)} />
      <BankServiceStatus isOpen={showServiceStatus} onClose={() => setShowServiceStatus(false)} />
      <AddFundsModal isOpen={showAddFunds} onClose={() => setShowAddFunds(false)} />
    </div>
  )
}
