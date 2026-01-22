"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, Edit, Save, X } from "@/components/ui/iconify-compat"
import { dataStore } from "@/lib/data-store"
import { formatCurrency } from "@/lib/form-utils"
import { StorageManager } from "@/lib/storage-manager"

interface ProfileScreenProps {
  onBack: () => void
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState(dataStore.getUserData())
  const [editedProfile, setEditedProfile] = useState(profile)

  // Load profile picture from IndexedDB if it exists
  useEffect(() => {
    const loadProfilePicture = async () => {
      try {
        const idbPicture = await StorageManager.load<string>("ecobank_profile_picture", "")
        if (idbPicture && !profile.profilePicture) {
          const updatedProfile = { ...profile, profilePicture: idbPicture }
          setProfile(updatedProfile)
          setEditedProfile(updatedProfile)
        }
      } catch (error) {
        console.warn("[v0] Failed to load profile picture from IndexedDB:", error)
      }
    }

    loadProfilePicture()
  }, [])

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setEditedProfile({ ...editedProfile, profilePicture: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (editedProfile.profilePicture !== profile.profilePicture) {
      dataStore.updateProfilePicture(editedProfile.profilePicture || "")
    }

    dataStore.updateUserData({
      name: editedProfile.name,
      email: editedProfile.email,
      phone: editedProfile.phone,
      address: editedProfile.address,
    })

    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">User Profile</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
        </Button>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Picture Section */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="relative inline-block">
              {editedProfile.profilePicture ? (
                <img
                  src={editedProfile.profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mb-4 mx-auto border-4 border-[#004A9F]"
                />
              ) : (
                <div className="w-24 h-24 bg-[#004A9F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl font-bold">{profile.name.charAt(0)}</span>
                </div>
              )}
              {isEditing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                  <Button
                    size="icon"
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#A4D233] hover:bg-[#8BC220] text-black"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="font-semibold text-lg">{profile.name}</div>
            <Badge
              className={`mt-2 ${profile.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {profile.status}
            </Badge>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Account Number</Label>
                <div className="font-medium">{profile.accountNumber}</div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Current Balance</Label>
                <div className="font-medium text-[#004A9F]">₦ {formatCurrency(profile.balance)}</div>
              </div>
            </div>
            <div>
              <Label htmlFor="bvn" className="text-sm text-gray-600">BVN</Label>
              {isEditing ? (
                <Input
                  id="bvn"
                  value={editedProfile.bvn}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bvn: e.target.value })}
                  placeholder="Enter your BVN"
                />
              ) : (
                <div className="font-medium">{profile.bvn}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                />
              ) : (
                <div className="font-medium">{profile.name}</div>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                />
              ) : (
                <div className="font-medium">{profile.email}</div>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                />
              ) : (
                <div className="font-medium">{profile.phone}</div>
              )}
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={editedProfile.address}
                  onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                />
              ) : (
                <div className="font-medium">{profile.address}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Change Transaction PIN
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Enable Biometric Login
            </Button>
          </CardContent>
        </Card>

        {/* Save/Cancel Buttons */}
        {isEditing && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-[#004A9F] hover:bg-[#003875]">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
