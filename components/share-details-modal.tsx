"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, MessageSquare, Send } from "@/components/ui/iconify-compat"

interface ShareDetailsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ShareDetailsModal({ isOpen, onClose }: ShareDetailsModalProps) {
  const userDetails = {
    name: "ADEFEMI JOHN OLAYEMI",
    accountNumber: "0099348976",
    bank: "Ecobank Nigeria",
    phone: "+234 801 234 5678",
  }

  const shareText = `Hi! Here are my banking details:
Name: ${userDetails.name}
Account: ${userDetails.accountNumber}
Bank: ${userDetails.bank}
Phone: ${userDetails.phone}

Send money easily with Ecobank Mobile!`

  const handleShare = (platform: string) => {
    // Simulate sharing functionality
    const encodedText = encodeURIComponent(shareText)

    switch (platform) {
      case "whatsapp":
        // WhatsApp share simulation
        console.log("Sharing to WhatsApp:", shareText)
        break
      case "sms":
        // SMS share simulation
        console.log("Sharing via SMS:", shareText)
        break
      case "telegram":
        // Telegram share simulation
        console.log("Sharing to Telegram:", shareText)
        break
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Share Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Details Preview */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[#004A9F] rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white text-xl font-bold">A</span>
                </div>
                <div className="font-semibold">{userDetails.name}</div>
                <div className="text-sm text-gray-600">{userDetails.accountNumber}</div>
                <div className="text-sm text-gray-600">{userDetails.bank}</div>
              </div>
            </CardContent>
          </Card>

          {/* Share Options */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700 text-center">Choose sharing method:</div>

            <Button
              onClick={() => handleShare("whatsapp")}
              className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center gap-3"
            >
              <MessageCircle className="h-5 w-5" />
              Share via WhatsApp
            </Button>

            <Button
              onClick={() => handleShare("sms")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-3"
            >
              <MessageSquare className="h-5 w-5" />
              Share via SMS
            </Button>

            <Button
              onClick={() => handleShare("telegram")}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white flex items-center gap-3"
            >
              <Send className="h-5 w-5" />
              Share via Telegram
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
