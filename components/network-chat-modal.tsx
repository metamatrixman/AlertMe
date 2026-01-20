"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Search, Send, X } from "@/components/ui/iconify-compat"

interface NetworkChatModalProps {
  isOpen: boolean
  onClose: () => void
}

interface User {
  id: string
  name: string
  status: "online" | "offline"
  type: "user" | "beneficiary" | "contact"
  avatar: string
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: string
}

export function NetworkChatModal({ isOpen, onClose }: NetworkChatModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  const users: User[] = [
    { id: "1", name: "John Doe", status: "online", type: "user", avatar: "J" },
    { id: "2", name: "Jane Smith", status: "offline", type: "beneficiary", avatar: "J" },
    { id: "3", name: "Mike Johnson", status: "online", type: "contact", avatar: "M" },
    { id: "4", name: "Sarah Wilson", status: "online", type: "user", avatar: "S" },
    { id: "5", name: "David Brown", status: "offline", type: "beneficiary", avatar: "D" },
  ]

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSendMessage = () => {
    if (chatMessage.trim() && selectedUser) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "You",
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString(),
      }
      setChatMessages([...chatMessages, newMessage])
      setChatMessage("")
    }
  }

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
    setChatMessages([
      {
        id: "1",
        sender: user.name,
        message: `Hello! I'm ${user.status === "online" ? "available" : "currently offline"}.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto h-[600px] p-0">
        {!selectedUser ? (
          // User List View
          <>
            <DialogHeader className="p-4 border-b">
              <DialogTitle>Network Chat</DialogTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 text-left"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="relative">
                        <div className="w-10 h-10 bg-[#004A9F] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{user.avatar}</span>
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            user.status === "online" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              user.type === "user"
                                ? "bg-blue-100 text-blue-800"
                                : user.type === "beneficiary"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.type}
                          </Badge>
                          <span className={`text-xs ${user.status === "online" ? "text-green-600" : "text-gray-500"}`}>
                            {user.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          // Chat View
          <>
            <DialogHeader className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)}>
                  <X className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <div className="w-8 h-8 bg-[#004A9F] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">{selectedUser.avatar}</span>
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-white ${
                        selectedUser.status === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{selectedUser.name}</div>
                    <div className="text-xs text-gray-500">{selectedUser.status}</div>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === "You" ? "bg-[#004A9F] text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="text-sm">{message.message}</div>
                      <div className={`text-xs mt-1 ${message.sender === "You" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message... (max 200 words)"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  maxLength={1000}
                  className="flex-1 min-h-[40px] max-h-[80px]"
                />
                <Button onClick={handleSendMessage} size="icon" className="bg-[#004A9F]">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-1">{chatMessage.length}/1000 characters</div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
