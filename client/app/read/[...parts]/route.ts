import {PASSAGE_TYPES} from '@/helpers/constants'
import {getBibleReading, getProverbsReading, getPsalmsReading} from '@/helpers/index'
import {bibleGatewayUrl, passageSearch} from '@/helpers/links'
import {IReadingPlan} from '@/helpers/types'
import {fetchBooks, goHome, goTo} from '@/lib/appLinks'
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import {NextRequest} from 'next/server'

dayjs.extend(dayOfYear)

/*
 * GET: `/read/{plan}/{yyyy-MM-dd}[/{ot|nt}]` - a Day's reading, as rybt.app links to it.
 *
 * On an iPhone with the app, iOS never asks: it opens the app on the Day. Everywhere else
 * this sends the reader on to BibleGateway, as the passage card always did. The website's
 * own links carry BibleGateway's search as `q`, the passage exactly as the card showed it,
 * which is used as it is. A link without one - typed, or shared from somewhere else - is
 * worked out from the plan, for this year only, since the plans are only ever this year's.
 */
export async function GET(request: NextRequest, {params}: {params: Promise<{parts: string[]}>}) {
  const q = request.nextUrl.searchParams.get('q')

  if (q) return goTo(bibleGatewayUrl(q))

  const [plan, day, testament] = (await params).parts

  if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day) || !dayjs(day).isValid() || dayjs(day).year() !== dayjs().year()) {
    return goHome()
  }

  let reading: IReadingPlan[]

  try {
    if (plan === PASSAGE_TYPES.BIBLE) {
      reading = getBibleReading(await fetchBooks())
    } else if (plan === PASSAGE_TYPES.PSALMS) {
      reading = getPsalmsReading()
    } else if (plan === PASSAGE_TYPES.PROVERBS) {
      reading = getProverbsReading(dayjs(day))
    } else {
      return goHome()
    }
  } catch {
    return goHome()
  }

  const found = reading.find((x) => x.date.format('YYYY-MM-DD') === day)
  const chapters = testament === 'nt' ? found?.ntReading : found?.otReading

  return chapters?.length ? goTo(bibleGatewayUrl(passageSearch(chapters))) : goHome()
}
