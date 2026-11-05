import {PASSAGE_TYPES} from '@/helpers/constants'
import {goHome, goTo, siteUrl} from '@/lib/appLinks'

/*
 * GET: `/today/{plan}` - a plan's Today page, as rybt.app links to it from a store event or
 * an ad: "open today's Proverbs", whatever day it is opened on.
 *
 * With the app installed, iOS and Android open it on that plan's Today page. Everywhere else
 * this is the same thing on this website: the plan's own page, which always opens on today.
 */
const pages: Record<string, string> = {
  [PASSAGE_TYPES.BIBLE]: '/',
  [PASSAGE_TYPES.PSALMS]: '/psalms',
  [PASSAGE_TYPES.PROVERBS]: '/proverbs',
}

export async function GET(_request: Request, {params}: {params: Promise<{plan: string}>}) {
  const page = pages[(await params).plan]

  return page ? goTo(`${siteUrl}${page}`) : goHome()
}
