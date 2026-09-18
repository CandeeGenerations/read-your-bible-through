import {IBibleBook} from '@/helpers/types'
import {NextResponse} from 'next/server'

// What rybt.app answers when a link into the app is opened somewhere the app is not: a
// computer, an Android phone, an iPhone without it. The same paths the app claims - /read
// and /bible (see app/aasa) - so a link is one URL whether or not the app is there.

// oxlint-disable-next-line no-undef
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://readyourbiblethrough.com'

/** The Bible's books, as the reading plan and the Chapters grid know them. Kept a day. */
export const fetchBooks = async (): Promise<IBibleBook[]> => {
  // oxlint-disable-next-line no-undef
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {next: {revalidate: 86_400}})

  if (!response.ok) throw new Error(`books: ${response.status}`)

  return response.json()
}

/** On to where the link could not take the reader itself. Not permanent: a link is kept. */
export const goTo = (url: string): NextResponse => NextResponse.redirect(url, 302)

/** Somewhere the link does not name anything real: the home page, rather than an error. */
export const goHome = (): NextResponse => goTo(`${siteUrl}/`)
