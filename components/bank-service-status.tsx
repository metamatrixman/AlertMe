"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NIGERIAN_BANKS } from "@/lib/banks-data"

interface BankServiceStatusProps {
  isOpen: boolean
  onClose: () => void
}

interface ServiceStatus {
  name: string
  type: "bank" | "wallet"
  status: "operational" | "degraded" | "down"
  uptime: number
  logo: string
}

export function BankServiceStatus({ isOpen, onClose }: BankServiceStatusProps) {
  // Generate service status for all banks and wallets
  const generateServiceStatus = (): ServiceStatus[] => {
    return NIGERIAN_BANKS.map((bank) => ({
      name: bank.name,
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
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Bank Service Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto">
          {/* Banks Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Banks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {banks.map((service) => (
                <div key={service.name + service.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-[#004A9F] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{service.logo}</span>
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(service.status)}`}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{service.name}</div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusBadgeColor(service.status)}`}>{service.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{service.uptime}%</div>
                    <div className="w-16 mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${getProgressColor(service.uptime)}`}
                          style={{ width: `${service.uptime}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Wallets Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Digital Wallets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {wallets.map((service) => (
                <div key={service.name + service.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-[#00B2A9] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{service.logo}</span>
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(service.status)}`}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{service.name}</div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusBadgeColor(service.status)}`}>{service.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{service.uptime}%</div>
                    <div className="w-16 mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${getProgressColor(service.uptime)}`}
                          style={{ width: `${service.uptime}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
