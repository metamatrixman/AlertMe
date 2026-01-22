"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { EnhancedBankServiceStatus } from "@/components/enhanced-bank-service-status"
import { dataStore } from "@/lib/data-store"
import {
  Building2,
  Send,
  ArrowDownToLine,
  Receipt,
  CreditCard,
  Smartphone,
  MoreHorizontal,
  User,
  Settings,
} from "lucide-react"

interface EnhancedSideMenuProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (screen: string) => void
}

export function EnhancedSideMenu({ isOpen, onClose, onNavigate }: EnhancedSideMenuProps) {
  const [showServiceStatus, setShowServiceStatus] = useState(false)

  const menuItems = [
    { icon: Building2, label: "Account", screen: "dashboard" },
    { icon: Send, label: "Send Money", screen: "transfer-options", hasDropdown: true },
    { icon: ArrowDownToLine, label: "Receive Money", screen: "dashboard" },
    { icon: Receipt, label: "Pay Bills", screen: "pay-bills" },
    { icon: CreditCard, label: "Quick Loan", screen: "loans" },
    { icon: Smartphone, label: "Airtime and Data", screen: "pay-bills" },
    { icon: MoreHorizontal, label: "Others", screen: "dashboard" },
    { icon: User, label: "Profile", screen: "beneficiary-management" },
  ]

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80 p-0">
          <div className="bg-white h-full">
            {/* Profile Section */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{dataStore.getUserData().name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{dataStore.getUserData().name}</h3>
                  <p className="text-sm text-gray-600">Last login: June 26, 2023 10:30</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowServiceStatus(true)}>
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-4">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start px-6 py-4 h-auto text-left"
                    onClick={() => {
                      onNavigate(item.screen)
                      onClose()
                    }}
                  >
                    <IconComponent className="h-5 w-5 mr-4 text-[#004A9F]" />
                    <span className="text-base">{item.label}</span>
                    {item.hasDropdown && <span className="ml-auto text-gray-400">▼</span>}
                  </Button>
                )
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <EnhancedBankServiceStatus isOpen={showServiceStatus} onClose={() => setShowServiceStatus(false)} />
    </>
  )
}
