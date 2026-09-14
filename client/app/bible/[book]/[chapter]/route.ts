import {bibleGatewayUrl} from '@/helpers/links'
import {fetchBooks, goHome, goTo} from '@/lib/appLinks'
import {NextRequest} from 'next/server'

/*
 * GET: `/bible/{book}/{chapter}` - a chapter of the Bible, as rybt.app links to it: /bible/JHN/3.
 * The book is its USFM id, as the app and the API name it.
 *
 * On an iPhone with the app, iOS opens it in the app's own King James Version. Everywhere
 * else this sends the reader on to the chapter on BibleGateway.
 */
export async function GET(_request: NextRequest, {params}: {params: Promise<{book: string; chapter: string}>}) {
  const {book: id, chapter} = await params

  try {
    const book = (await fetchBooks()).find((x) => x.id.toUpperCase() === id.toUpperCase())

    if (!book?.chapters.some((x) => x.number === chapter)) return goHome()

    return goTo(bibleGatewayUrl(`${book.name} ${chapter}`))
  } catch {
    return goHome()
  }
}
