import type {Metadata} from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What the Read Your Bible Through website and app collect, why, and how to delete it.',
}

export default function PrivacyLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>
}
