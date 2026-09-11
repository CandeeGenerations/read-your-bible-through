import type {Metadata} from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get help with the Read Your Bible Through website and iPhone app.',
}

export default function SupportLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>
}
