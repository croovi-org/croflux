'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function CalendarSuccessInner() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')

  useEffect(() => {
    if (userId) {
      window.location.href = `/dashboard/${userId}?calendar=connected`
    } else {
      window.location.href = '/dashboard'
    }
  }, [userId])

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      background: '#0f0e0d',
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      <p>Connecting Google Calendar...</p>
    </div>
  )
}

export default function CalendarSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CalendarSuccessInner />
    </Suspense>
  )
}
