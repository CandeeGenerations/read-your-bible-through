import {PassageType} from './constants'
import {ITestamentReading} from './types'

/**
 * Whether the website mentions the iPhone app at all - its landing page, the link to it in
 * the footer, Safari's banner, and passages opening through rybt.app. `NEXT_PUBLIC_SHOW_APP`
 * true shows them; anything else leaves the website as it was before the app.
 */
// oxlint-disable-next-line no-undef
export const SHOW_APP = process.env.NEXT_PUBLIC_SHOW_APP === 'true'

/**
 * The public TestFlight beta, for trying a build before it reaches the App Store. The landing
 * page links here only while `APP_STORE_ID` is unset.
 */
export const TESTFLIGHT_URL = 'https://candee.link/rybtb'

/**
 * The app's Apple ID in App Store Connect (App Information > Apple ID), a number. The app is
 * on the App Store: the landing page's button is the App Store badge, and Safari on an iPhone
 * offers the app in a banner at the top of every page.
 */
export const APP_STORE_ID: string | undefined = '6811186794'

export const APP_STORE_URL = APP_STORE_ID ? `https://apps.apple.com/app/id${APP_STORE_ID}` : undefined

/**
 * rybt.app, once it serves this site. A passage links there rather than to BibleGateway:
 * on an iPhone with the app, iOS opens the app on the Day's reading; anywhere else the same
 * path here sends the reader on to BibleGateway (app/read). It has to be another domain -
 * iOS opens a link to the domain of the page it is on in Safari, never in the app. Unset,
 * passages link to BibleGateway directly, as before.
 */
// oxlint-disable-next-line no-undef
export const APP_LINK_URL = SHOW_APP ? process.env.NEXT_PUBLIC_APP_LINK_URL : undefined

/** A reading as BibleGateway is searched for it: "Genesis 1,2,Matthew 1". */
export const passageSearch = (reading: ITestamentReading[]): string => {
  const books: {book: string; chapters: string[]}[] = []

  for (const item of reading) {
    const book = books.find((x) => x.book === item.name)

    if (book) {
      book.chapters.push(item.chapter)
    } else {
      books.push({book: item.name, chapters: [item.chapter]})
    }
  }

  return books.map((x) => `${x.book} ${x.chapters.join(',')}`).join(',')
}

export const bibleGatewayUrl = (search: string): string =>
  `https://www.biblegateway.com/passage/?version=AKJV&search=${encodeURIComponent(search)}`

/**
 * Where a passage card opens: rybt.app's link for the Day, or BibleGateway. The link carries
 * BibleGateway's search as `q`, which the app ignores and the fallback uses as it is - the
 * passage exactly as the card showed it, whatever day of whatever year it is where the
 * fallback runs.
 */
export const passageUrl = (
  reading: ITestamentReading[],
  plan: PassageType,
  day: string,
  testament?: 'ot' | 'nt',
): string => {
  const search = passageSearch(reading)

  if (!APP_LINK_URL) return bibleGatewayUrl(search)

  return `${APP_LINK_URL}/read/${plan}/${day}${testament ? `/${testament}` : ''}?q=${encodeURIComponent(search)}`
}
