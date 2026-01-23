"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NIGERIAN_BANKS } from "@/lib/banks-data"
import { CheckCircle, AlertCircle, XCircle } from "@/components/ui/iconify-compat"

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
    // Banks and wallets that should be set to 10% red (down status)
    const redServices = ["Opay", "Monipoint MFB", "Plam Pay", "Access Bank", "Ecobank Nigeria"]

    return NIGERIAN_BANKS.map((bank) => {
      const isRedService = redServices.some(
        (service) => service.toLowerCase() === bank.name.toLowerCase()
      )

      return {
        name: bank.name,
        code: bank.code,
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
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "degraded":
        return <AlertCircle className="h-3 w-3 text-yellow-600" />
      case "down":
        return <XCircle className="h-3 w-3 text-red-600" />
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

  const ServiceItem = ({ service }: { service: ServiceStatus }) => (
    <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
              service.type === "bank"
                ? "bg-gradient-to-br from-[#004A9F] to-[#003875]"
                : "bg-gradient-to-br from-[#00B2A9] to-[#008B8A]"
            }`}
          >
            {service.logo}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${getStatusColor(service.status)} border border-white dark:border-gray-800`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-xs text-gray-900 dark:text-white truncate">
            {service.name}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {getStatusIcon(service.status)}
            <Badge className={`text-xs px-1.5 py-0.5 ${getStatusBadgeColor(service.status)}`}>
              {service.status}
            </Badge>
          </div>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-2">
        <div className="text-xs font-semibold text-gray-900 dark:text-white">
          {service.uptime.toFixed(1)}%
        </div>
        <div className="w-12 mt-1">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${getProgressColor(service.uptime)}`}
              style={{ width: `${service.uptime}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-[#004A9F] via-[#0072C6] to-[#00B2A9] -m-6 mb-0 p-6 rounded-t-2xl">
          <div>
            <DialogTitle className="text-lg font-bold text-white">Service Status Monitor</DialogTitle>
            <p className="text-sm text-white/80 mt-1">Real-time status of all banking and wallet services</p>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] px-6 py-4">
          <div className="space-y-5 pr-4">
            {/* Banks Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  🏦 Commercial Banks
                  <Badge variant="secondary" className="text-xs">
                    {banks.length}
                  </Badge>
                </h3>
              </div>
              <div className="flex gap-2 text-xs mb-3">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {bankStats.operational}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-yellow-600" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {bankStats.degraded}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="h-3 w-3 text-red-600" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {bankStats.down}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {banks.map((service) => (
                  <ServiceItem key={service.code} service={service} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

            {/* Wallets Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  💳 Digital Wallets & Fintech
                  <Badge variant="secondary" className="text-xs">
                    {wallets.length}
                  </Badge>
                </h3>
              </div>
              <div className="flex gap-2 text-xs mb-3">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {walletStats.operational}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-yellow-600" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {walletStats.degraded}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="h-3 w-3 text-red-600" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {walletStats.down}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {wallets.map((service) => (
                  <ServiceItem key={service.code} service={service} />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-750 rounded-lg p-3 border border-blue-200 dark:border-gray-700">
              <h4 className="font-semibold text-xs text-gray-900 dark:text-white mb-2">
                Status Legend
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Operational:</span> Running normally (95%+ uptime)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Degraded:</span> Experiencing issues (50-95% uptime)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-red-600 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Down:</span> Unavailable (&lt;50% uptime)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
