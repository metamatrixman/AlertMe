"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NIGERIAN_BANKS } from "@/lib/banks-data"

interface EnhancedBankServiceStatusProps {
  isOpen: boolean
  onClose: () => void
}

interface ServiceStatus {
  name: string
  code: string
  type: "bank" | "wallet"
  status: "operational" | "degraded" | "down"
  uptime: number
  logo: string
}

export function EnhancedBankServiceStatus({ isOpen, onClose }: EnhancedBankServiceStatusProps) {
  // Generate service status for all banks and wallets
  const generateServiceStatus = (): ServiceStatus[] => {
    return NIGERIAN_BANKS.map((bank) => ({
      name: bank.name,
      code: bank.code,
      type: bank.type,
      status: Math.random() > 0.8 ? (Math.random() > 0.5 ? "degraded" : "down") : "operational",
      uptime: Math.random() * 15 + 85, // Random uptime between 85-100%
      logo: bank.name.charAt(0),
    }))
  }

  const services = generateServiceStatus()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "down":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800"
      case "degraded":
        return "bg-yellow-100 text-yellow-800"
      case "down":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressColor = (uptime: number) => {
    if (uptime >= 98) return "bg-green-500"
    if (uptime >= 95) return "bg-yellow-500"
    return "bg-red-500"
  }

  const banks = services.filter((s) => s.type === "bank")
  const wallets = services.filter((s) => s.type === "wallet")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[85vh] overflow-hidden bg-white dark:bg-gray-900">
        <DialogHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 -m-6 mb-4 p-4 rounded-t-2xl border-b border-gray-200/50 dark:border-gray-700/50">
          <DialogTitle className="text-base font-semibold">Service Status</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh]">
          <div className="space-y-3">
            {/* Banks Section */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-700">Banks ({banks.length})</h3>
              <div className="space-y-2">
                {banks.map((service) => (
                  <div key={service.code} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-6 h-6 bg-[#004A9F] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{service.logo}</span>
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${getStatusColor(service.status)}`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-xs truncate">{service.name}</div>
                        <Badge className={`text-xs px-1 py-0 ${getStatusBadgeColor(service.status)}`}>
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium">{service.uptime.toFixed(1)}%</div>
                      <div className="w-12 mt-0.5">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${getProgressColor(service.uptime)}`}
                            style={{ width: `${service.uptime}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallets Section */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-700">Digital Wallets ({wallets.length})</h3>
              <div className="space-y-2">
                {wallets.map((service) => (
                  <div key={service.code} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-6 h-6 bg-[#00B2A9] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{service.logo}</span>
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${getStatusColor(service.status)}`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-xs truncate">{service.name}</div>
                        <Badge className={`text-xs px-1 py-0 ${getStatusBadgeColor(service.status)}`}>
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium">{service.uptime.toFixed(1)}%</div>
                      <div className="w-12 mt-0.5">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${getProgressColor(service.uptime)}`}
                            style={{ width: `${service.uptime}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
