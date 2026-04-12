"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type ProfileContextValue = {
  displayName: string
  initials: string
  avatarUrl: string | null
  workspaceName: string
  streak: number
  setDisplayName: (name: string) => void
  setInitials: (initials: string) => void
  setAvatarUrl: (url: string | null) => void
  setWorkspaceName: (name: string) => void
  setStreak: (streak: number) => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({
  children,
  initial,
}: {
  children: ReactNode
  initial: {
    displayName: string
    initials: string
    avatarUrl: string | null
    workspaceName: string
    streak: number
  }
}) {
  const [displayName, setDisplayName] = useState(initial.displayName)
  const [initials, setInitials] = useState(initial.initials)
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl)
  const [workspaceName, setWorkspaceName] = useState(initial.workspaceName)
  const [streak, setStreak] = useState(initial.streak)

  return (
    <ProfileContext.Provider
      value={{
        displayName,
        initials,
        avatarUrl,
        workspaceName,
        streak,
        setDisplayName,
        setInitials,
        setAvatarUrl,
        setWorkspaceName,
        setStreak,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider")
  return ctx
}

export function useOptionalProfile() {
  return useContext(ProfileContext)
}

// Helper — same logic as getInitials in workspace/data.ts
export function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return (parts[0]?.[0] ?? "?").toUpperCase()
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase()
}
