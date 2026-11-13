import {APP_STORE_ID, PLAY_STORE_ID} from '@/helpers/links'
import {goHome, goTo} from '@/lib/appLinks'

/*
 * GET: `/go/{campaign}/{ios|android}` - a link to the app's store page, on our own domain, that
 * carries an ad or flyer's campaign through to the store: rybt.app/go/meta-m1-static/ios.
 *
 * Meta's Traffic ads may not link to a store directly ("App Url is only supported by App
 * Installs objective"), and an App promotion campaign needs Meta's SDK in the apps, which they
 * will not carry. So an ad links here, and this sends it straight on:
 *
 * - ios: the App Store, with App Store Connect's provider and campaign tokens, so its
 *   Campaigns report counts the ad's page views and installs.
 * - android: Google Play, with the campaign as the install referrer, which Play Console
 *   reports per campaign. The channel is the campaign's first word: meta-m1-static is meta.
 *
 * The campaign is named <channel>-<campaign>-<creative>, letters, numbers and hyphens, and Apple
 * keeps at most 30 characters of it. Anything else, or an unknown store, goes home.
 */
const PROVIDER_TOKEN = '129094825'
const CAMPAIGN = /^[a-z0-9]+(-[a-z0-9]+)*$/

export async function GET(_request: Request, {params}: {params: Promise<{campaign: string; store: string}>}) {
  const {campaign, store} = await params

  if (!CAMPAIGN.test(campaign) || campaign.length > 30) return goHome()

  if (store === 'ios' && APP_STORE_ID) {
    return goTo(`https://apps.apple.com/app/apple-store/id${APP_STORE_ID}?pt=${PROVIDER_TOKEN}&ct=${campaign}&mt=8`)
  }

  if (store === 'android' && PLAY_STORE_ID) {
    const referrer = encodeURIComponent(`utm_source=${campaign.split('-')[0]}&utm_campaign=${campaign}`)

    return goTo(`https://play.google.com/store/apps/details?id=${PLAY_STORE_ID}&referrer=${referrer}`)
  }

  return goHome()
}
