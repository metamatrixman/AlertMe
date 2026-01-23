"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NIGERIAN_BANKS } from "@/lib/banks-data"
import { CheckCircle, AlertCircle, XCircle } from "@/components/ui/iconify-compat"

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
    // Banks and wallets that should be set to 10% red (down status)
    const redServices = ["Opay", "Monipoint", "Access Bank", "Ecobank Nigeria"]

    return NIGERIAN_BANKS.map((bank) => {
      const isRedService = redServices.some(
        (service) => service.toLowerCase() === bank.name.toLowerCase()
      )

      return {
        name: bank.name,
        type: bank.type,
        status: isRedService ? "down" : Math.random() > 0.85 ? (Math.random() > 0.5 ? "degraded" : "down") : "operational",
        uptime: isRedService ? 10 : Math.random() * 15 + 85,
        logo: bank.name.charAt(0),
      }
    })
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "down":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
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
    if (uptime >= 50) return "bg-orange-500"
    return "bg-red-500"
  }

  const banks = services.filter((s) => s.type === "bank").sort((a, b) => a.name.localeCompare(b.name))
  const wallets = services.filter((s) => s.type === "wallet").sort((a, b) => a.name.localeCompare(b.name))

  // Calculate statistics
  const bankStats = {
    operational: banks.filter((b) => b.status === "operational").length,
    degraded: banks.filter((b) => b.status === "degraded").length,
    down: banks.filter((b) => b.status === "down").length,
  }

  const walletStats = {
    operational: wallets.filter((w) => w.status === "operational").length,
    degraded: wallets.filter((w) => w.status === "degraded").length,
    down: wallets.filter((w) => w.status === "down").length,
  }

  const renderServiceList = (servicesList: ServiceStatus[], category: string) => (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
      <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            {category === "bank" ? "🏦 Commercial Banks" : "💳 Digital Wallets"}
            <Badge variant="secondary" className="text-xs">
              {servicesList.length}
            </Badge>
          </CardTitle>
        </div>
        <div className="flex gap-2 text-xs mt-2">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span className="text-gray-600 dark:text-gray-400">
              {category === "bank" ? bankStats.operational : walletStats.operational}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-yellow-600" />
            <span className="text-gray-600 dark:text-gray-400">
              {category === "bank" ? bankStats.degraded : walletStats.degraded}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="h-3 w-3 text-red-600" />
            <span className="text-gray-600 dark:text-gray-400">
              {category === "bank" ? bankStats.down : walletStats.down}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="space-y-2">
          {servicesList.map((service) => (
            <div
              key={service.name + service.type}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      service.type === "bank"
                        ? "bg-gradient-to-br from-[#004A9F] to-[#003875]"
                        : "bg-gradient-to-br from-[#00B2A9] to-[#008B8A]"
                    }`}
                  >
                    {service.logo}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(service.status)} border border-white dark:border-gray-800`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {service.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${getStatusBadgeColor(service.status)} px-2 py-0.5`}>
                      {service.status}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {service.uptime.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 w-20 ml-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressColor(service.uptime)}`}
                    style={{ width: `${service.uptime}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-[#004A9F] via-[#0072C6] to-[#00B2A9] -m-6 mb-4 p-6 rounded-t-2xl border-b border-gray-200/50">
          <DialogTitle className="text-lg font-bold text-white">Service Status Monitor</DialogTitle>
          <p className="text-sm text-white/80 mt-1">Real-time status of all banking and wallet services</p>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent max-h-[calc(90vh-150px)]">
          {/* Banks Section */}
          {renderServiceList(banks, "bank")}

          {/* Wallets Section */}
          {renderServiceList(wallets, "wallet")}

          {/* Legend */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-750">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                Status Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Operational</span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">Service running normally (95%+ uptime)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">Degraded</span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">Service experiencing issues (50-95% uptime)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Down</span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">Service unavailable (&lt;50% uptime)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
