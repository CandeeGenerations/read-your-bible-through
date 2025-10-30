import type {Metadata} from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Read Your Bible Through - read the entire Bible in one year.',
}

export default function TermsLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>
}
