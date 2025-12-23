"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle, Check } from "lucide-react"
import { dataStore } from "@/lib/data-store"

interface BeneficiaryLookupProps {
  accountNumber: string
  onBeneficiaryFound: (name: string) => void
  onAccountNumberChange: (value: string) => void
}

export function BeneficiaryLookup({
  accountNumber,
  onBeneficiaryFound,
  onAccountNumberChange,
}: BeneficiaryLookupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [foundName, setFoundName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lookupAttempted, setLookupAttempted] = useState(false)

  useEffect(() => {
    if (!accountNumber || accountNumber.length < 10) {
      setIsLoading(false)
      setFoundName(null)
      setError(null)
      setLookupAttempted(false)
      return
    }

    setIsLoading(true)
    setError(null)
    setLookupAttempted(true)

    const lookupTimer = setTimeout(() => {
      const beneficiary = dataStore.findBeneficiaryByAccount(accountNumber)

      if (beneficiary) {
        setFoundName(beneficiary.name)
        onBeneficiaryFound(beneficiary.name)
        setError(null)
      } else {
        setFoundName(null)
        setError("Unable to fetch name provide account name")
      }

      setIsLoading(false)
    }, 5000)

    return () => clearTimeout(lookupTimer)
  }, [accountNumber, onBeneficiaryFound])

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 block">Account Number</label>
      <div className="relative">
        <Input
          placeholder="Enter account number"
          value={accountNumber}
          onChange={(e) => onAccountNumberChange(e.target.value)}
          className="bg-white pr-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-[#004A9F]" />
          </div>
        )}
        {foundName && !isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Check className="h-5 w-5 text-green-500" />
          </div>
        )}
        {error && !isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>

      {isLoading && (
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <Loader2 className="h-3 w-3 animate-spin" />
          Looking up beneficiary...
        </div>
      )}

      {foundName && !isLoading && (
        <div className="text-xs text-green-600 font-medium flex items-center gap-2">
          <Check className="h-3 w-3" />
          Beneficiary found: {foundName}
        </div>
      )}

      {error && !isLoading && (
        <div className="text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
    </div>
  )
}
