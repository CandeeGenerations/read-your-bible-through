import type {Metadata} from 'next'
import type React from 'react'

export const metadata: Metadata = {
  title: 'Data Deletion',
  description: 'Request deletion of your personal data from Read Your Bible Through.',
}

export default function DataLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>
}
