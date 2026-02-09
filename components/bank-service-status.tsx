"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NIGERIAN_BANKS } from "@/lib/banks-data"
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Search,
  Filter,
  Building2,
  Wallet,
  HelpCircle
} from "@/components/ui/iconify-compat"

interface BankServiceStatusProps {
  isOpen: boolean
  onClose: () => void
}

type ServiceStatus = "operational" | "degraded" | "down" | "maintenance"

interface ServiceStatusData {
  name: string
  type: "bank" | "wallet" | "microfinance"
  status: ServiceStatus
  uptime: number
  lastUpdated: string
  affectedServices: string[]
  logo: string
}

// Generate mock service status data
const generateServiceStatus = (): ServiceStatusData[] => {
  // Services with known issues (for demo purposes)
  const degradedServices = ["Opay", "Moniepoint", "Access Bank"]
  const downServices = ["Ecobank Nigeria", "PalmPay"]
  const maintenanceServices = ["Zenith Bank", "GTBank Mobile Banking"]

  const bankServices = NIGERIAN_BANKS.filter(b => b.type === "bank" || b.type === "microfinance" || b.type === "wallet")
  
  return bankServices.map((bank) => {
    let status: ServiceStatus = "operational"
    let affectedServices: string[] = []
    
    if (degradedServices.some(s => s.toLowerCase() === bank.name.toLowerCase())) {
      status = "degraded"
      affectedServices = ["Mobile App", "USSD Transactions", "Card Payments"]
    } else if (downServices.some(s => s.toLowerCase() === bank.name.toLowerCase())) {
      status = "down"
      affectedServices = ["All Services", "Customer Support", "API Access"]
    } else if (maintenanceServices.some(s => s.toLowerCase() === bank.name.toLowerCase())) {
      status = "maintenance"
      affectedServices = ["Scheduled Maintenance", "Expected completion: 2 hours"]
    } else {
      // Random status for others (mostly operational)
      const rand = Math.random()
      if (rand > 0.95) {
        status = "degraded"
        affectedServices = ["Slow Response Times", "Transaction Delays"]
      } else if (rand > 0.98) {
        status = "down"
        affectedServices = ["Service Unavailable"]
      } else if (rand > 0.99) {
        status = "maintenance"
        affectedServices = ["Planned Maintenance Window"]
      }
    }

    return {
      name: bank.name,
      type: bank.type as "bank" | "wallet" | "microfinance",
      status,
      uptime: status === "operational" ? (95 + Math.random() * 5) : 
              status === "degraded" ? (50 + Math.random() * 40) :
              status === "maintenance" ? (0 + Math.random() * 20) : (0 + Math.random() * 30),
      lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      affectedServices,
      logo: bank.name.charAt(0),
    }
  })
}

export function BankServiceStatus({ isOpen, onClose }: BankServiceStatusProps) {
  const [services, setServices] = useState<ServiceStatusData[]>([])
  const [filter, setFilter] = useState<"all" | ServiceStatus>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = useCallback(() => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setServices(generateServiceStatus())
      setLastRefreshed(new Date())
      setIsRefreshing(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (isOpen) {
      refreshData()
    }
  }, [isOpen, refreshData])

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "all" || service.status === filter
    return matchesSearch && matchesFilter
  })

  // Separate banks and wallets
  const banks = filteredServices.filter(s => s.type === "bank" || s.type === "microfinance")
  const wallets = filteredServices.filter(s => s.type === "wallet")

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "down":
        return "bg-red-500"
      case "maintenance":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusTextColor = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return "text-green-600"
      case "degraded":
        return "text-yellow-600"
      case "down":
        return "text-red-600"
      case "maintenance":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBadgeColor = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800 border-green-200"
      case "degraded":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "down":
        return "bg-red-100 text-red-800 border-red-200"
      case "maintenance":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "down":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return "Operational"
      case "degraded":
        return "Partial Disruption"
      case "down":
        return "Major Outage"
      case "maintenance":
        return "Maintenance"
      default:
        return "Unknown"
    }
  }

  const getLogoColor = (type: string, status: ServiceStatus) => {
    if (type === "bank") {
      return status === "operational" ? "bg-gradient-to-br from-[#004A9F] to-[#003875]" : 
             status === "degraded" ? "bg-gradient-to-br from-[#f59e0b] to-[#d97706]" :
             status === "down" ? "bg-gradient-to-br from-[#ef4444] to-[#dc2626]" :
             "bg-gradient-to-br from-[#3b82f6] to-[#2563eb]"
    }
    return status === "operational" ? "bg-gradient-to-br from-[#00B2A9] to-[#008B8A]" :
           status === "degraded" ? "bg-gradient-to-br from-[#f59e0b] to-[#d97706]" :
           status === "down" ? "bg-gradient-to-br from-[#ef4444] to-[#dc2626]" :
           "bg-gradient-to-br from-[#3b82f6] to-[#2563eb]"
  }

  const formatLastUpdated = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const toggleExpand = (name: string) => {
    setExpandedItem(expandedItem === name ? null : name)
  }

  const renderServiceList = (servicesList: ServiceStatusData[], category: string, icon: React.ReactNode) => (
    <div className="mb-6">
      {/* Category Header */}
      <div className="flex items-center gap-2 mb-[5px] px-[5px]">
        {icon}
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
          {category === "bank" ? "🏦 Banks & Microfinance" : "💳 Digital Wallets & Payment Platforms"}
        </h3>
        <Badge variant="secondary" className="text-xs">
          {servicesList.length}
        </Badge>
        <Badge className={`text-xs ${
          category === "bank" 
            ? banks.filter(s => s.status === "operational").length === banks.length ? "bg-green-100 text-green-700" :
              banks.filter(s => s.status === "down").length > 0 ? "bg-red-100 text-red-700" :
              "bg-yellow-100 text-yellow-700"
            : wallets.filter(s => s.status === "operational").length === wallets.length ? "bg-green-100 text-green-700" :
              wallets.filter(s => s.status === "down").length > 0 ? "bg-red-100 text-red-700" :
              "bg-yellow-100 text-yellow-700"
        }`}>
          {category === "bank" 
            ? `${banks.filter(s => s.status === "operational").length}/${banks.length} Operational`
            : `${wallets.filter(s => s.status === "operational").length}/${wallets.length} Operational`}
        </Badge>
      </div>

      {/* Services List */}
      <div className="space-y-[5px]">
        {servicesList.map((service) => (
          <div
            key={service.name}
            className={`relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 ${
              expandedItem === service.name ? "ring-2 ring-[#004A9F]/20" : "hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            {/* Main Row */}
            <div 
              className="flex items-center p-[5px] cursor-pointer"
              onClick={() => toggleExpand(service.name)}
            >
              {/* Logo */}
              <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm ${getLogoColor(service.type, service.status)}`}>
                {service.logo}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(service.status)} border-2 border-white dark:border-gray-800`} />
              </div>

              {/* Institution Info */}
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white truncate">{service.name}</span>
                  {expandedItem === service.name ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-xs px-[5px] py-0.5 ${getStatusBadgeColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                    <span className="ml-1">{getStatusLabel(service.status)}</span>
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {service.uptime.toFixed(1)}% uptime
                  </span>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>{formatLastUpdated(service.lastUpdated)}</span>
                </div>
              </div>
            </div>

            {/* Expandable Details */}
            {expandedItem === service.name && (
              <div className="px-[5px] pb-[5px] pt-0 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700">
                <div className="pt-[5px] space-y-[5px]">
                  {/* Affected Services */}
                  {service.affectedServices.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-[5px]">Affected Services</h4>
                      <div className="flex flex-wrap gap-[5px]">
                        {service.affectedServices.map((serviceName, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-white dark:bg-gray-700">
                            {serviceName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-[5px] text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Response Time</span>
                      <div className={`font-medium ${
                        service.status === "operational" ? "text-green-600" :
                        service.status === "degraded" ? "text-yellow-600" :
                        service.status === "down" ? "text-red-600" : "text-blue-600"
                      }`}>
                        {service.status === "operational" ? "< 200ms" :
                         service.status === "degraded" ? "500ms - 2s" :
                         service.status === "down" ? "> 10s" : "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Last Incident</span>
                      <div className="font-medium text-gray-700 dark:text-gray-300">
                        {service.status === "operational" ? "None" : "Active Now"}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-[5px]">
                    <Button size="sm" variant="outline" className="text-xs flex-1">
                      <HelpCircle className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" className="text-xs flex-1 bg-[#004A9F] hover:bg-[#003875]">
                      Report Issue
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xl mx-auto max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-[#004A9F] via-[#0072C6] to-[#00B2A9] -m-[5px] mb-[5px] p-[5px] rounded-t-2xl border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold text-white">Service Status Monitor</DialogTitle>
              <p className="text-sm text-white/80 mt-[5px]">Real-time status of all banking and wallet services</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={refreshData}
                disabled={isRefreshing}
                className="text-white hover:bg-white/20"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
          
          {/* Refresh Info */}
          <div className="flex items-center gap-2 text-xs text-white/70 mt-[5px]">
            <Clock className="h-3 w-3" />
            <span>Last updated: {lastRefreshed.toLocaleTimeString()}</span>
            {isRefreshing && <span className="text-white/90">Refreshing...</span>}
          </div>
        </DialogHeader>

        {/* Filter Section */}
        <div className="px-[5px] pb-[5px] space-y-[5px]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search institutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-[#004A9F] hover:bg-[#003875]" : ""}
            >
              All ({services.length})
            </Button>
            <Button
              size="sm"
              variant={filter === "operational" ? "default" : "outline"}
              onClick={() => setFilter("operational")}
              className={filter === "operational" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Operational ({services.filter(s => s.status === "operational").length})
            </Button>
            <Button
              size="sm"
              variant={filter === "degraded" ? "default" : "outline"}
              onClick={() => setFilter("degraded")}
              className={filter === "degraded" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              Disrupted ({services.filter(s => s.status === "degraded").length})
            </Button>
            <Button
              size="sm"
              variant={filter === "down" ? "default" : "outline"}
              onClick={() => setFilter("down")}
              className={filter === "down" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <XCircle className="h-3 w-3 mr-1" />
              Outage ({services.filter(s => s.status === "down").length})
            </Button>
            <Button
              size="sm"
              variant={filter === "maintenance" ? "default" : "outline"}
              onClick={() => setFilter("maintenance")}
              className={filter === "maintenance" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <Clock className="h-3 w-3 mr-1" />
              Maintenance ({services.filter(s => s.status === "maintenance").length})
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-[5px] pb-[5px] overflow-y-auto max-h-[calc(90vh-280px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {/* Banks Section */}
          {banks.length > 0 && renderServiceList(banks, "bank", <Building2 className="h-4 w-4 text-[#004A9F]" />)}

          {/* Wallets Section */}
          {wallets.length > 0 && renderServiceList(wallets, "wallet", <Wallet className="h-4 w-4 text-[#00B2A9]" />)}

          {/* Empty State */}
          {filteredServices.length === 0 && (
            <div className="text-center py-[5px]">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-[5px]" />
              <p className="text-gray-600 dark:text-gray-400">No institutions found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Legend */}
          <Card className="mt-[5px] border-0 shadow-sm bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-750">
            <CardHeader className="pb-[5px]">
              <CardTitle className="text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Status Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-[5px] text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-700 dark:text-green-400">Operational</span>
                <span className="text-gray-500 dark:text-gray-400">- Running normally</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-yellow-700 dark:text-yellow-400">Partial Disruption</span>
                <span className="text-gray-500 dark:text-gray-400">- Some issues</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="font-medium text-red-700 dark:text-red-400">Major Outage</span>
                <span className="text-gray-500 dark:text-gray-400">- Service down</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-blue-700 dark:text-blue-400">Maintenance</span>
                <span className="text-gray-500 dark:text-gray-400">- Planned downtime</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
