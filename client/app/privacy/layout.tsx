import type {Metadata} from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Read Your Bible Through - learn how we protect your personal information.',
}

export default function PrivacyLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>
}
