"use client"

import { useState, useEffect, useRef } from "react"
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
  const [foundBank, setFoundBank] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lookupAttempted, setLookupAttempted] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear previous timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!accountNumber || accountNumber.length < 10) {
      setIsLoading(false)
      setFoundName(null)
      setFoundBank(null)
      setError(null)
      setLookupAttempted(false)
      return
    }

    setIsLoading(true)
    setError(null)
    setFoundName(null)
    setFoundBank(null)
    setLookupAttempted(true)

    const trimmedAccountNumber = accountNumber.trim()

    // Debounce the lookup - wait 500ms after user stops typing
    debounceRef.current = setTimeout(() => {
      // Simulate network delay for realistic UX
      timeoutRef.current = setTimeout(() => {
        console.log("[v0] Searching for beneficiary with account:", trimmedAccountNumber)

        const beneficiary = dataStore.findBeneficiaryByAccount(trimmedAccountNumber)

        if (beneficiary) {
          console.log("[v0] Beneficiary found:", beneficiary.name, "Bank:", beneficiary.bank)
          console.log("[v0] Account number match verified: ", beneficiary.accountNumber === trimmedAccountNumber)
          setFoundName(beneficiary.name)
          setFoundBank(beneficiary.bank)
          onBeneficiaryFound(beneficiary.name)
          setError(null)
          setIsLoading(false)
        } else {
          console.log("[v0] No beneficiary found for account:", trimmedAccountNumber)
          console.log("[v0] Available beneficiaries:", dataStore.getBeneficiaries().map(b => ({ name: b.name, account: b.accountNumber })))
          setFoundName(null)
          setFoundBank(null)
          setError("Beneficiary not found. Please check the account number.")
          setIsLoading(false)
        }
      }, 800) // Simulate 800ms network delay
    }, 500) // Debounce for 500ms

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [accountNumber])

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 block">Account Number</label>
      <div className="relative">
        <Input
          placeholder="Enter account number (min. 10 digits)"
          value={accountNumber}
          onChange={(e) => onAccountNumberChange(e.target.value)}
          className="bg-white pr-10 transition-all"
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

      {/* Loading State */}
      {isLoading && accountNumber.length >= 10 && (
        <div className="animate-pulse">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-md border border-blue-200">
            <Loader2 className="h-4 w-4 animate-spin text-[#004A9F]" />
            <span className="text-xs text-blue-700 font-medium">Verifying beneficiary...</span>
          </div>
        </div>
      )}

      {/* Success State */}
      {foundName && !isLoading && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start gap-2 px-3 py-2 bg-green-50 rounded-md border border-green-200">
            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-green-700 font-semibold">Beneficiary Verified</p>
              <p className="text-xs text-green-600 font-medium">{foundName}</p>
              {foundBank && <p className="text-xs text-green-600">{foundBank}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start gap-2 px-3 py-2 bg-red-50 rounded-md border border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-red-700 font-semibold">Verification Failed</p>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
