'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function CalendarErrorInner() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')

  useEffect(() => {
    if (userId) {
      window.location.href = `/dashboard/${userId}?calendar=error`
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
      <p>Redirecting...</p>
    </div>
  )
}

export default function CalendarErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CalendarErrorInner />
    </Suspense>
  )
}
