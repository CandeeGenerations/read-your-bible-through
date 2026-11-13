import {appStoreCampaignUrl, isCampaign, playStoreCampaignUrl} from '@/helpers/links'
import {goHome, goTo} from '@/lib/appLinks'

/*
 * GET: `/go/{campaign}/{ios|android}` - a link to the app's store page, on our own domain, that
 * carries a flyer or QR code's campaign through to the store: rybt.app/go/flyer-churches/ios.
 *
 * - ios: the App Store, with App Store Connect's provider and campaign tokens, so its
 *   Campaigns report counts the link's page views and installs.
 * - android: Google Play, with the campaign as the install referrer, which Play Console
 *   reports per campaign.
 *
 * Not for Meta's ads: Meta follows the redirect, finds a store, and refuses it in a Traffic ad
 * ("App Url is only supported by App Installs objective"). An ad links to the landing page
 * instead, /app?ct={campaign}, whose badges carry the campaign (app/app/StoreLink).
 *
 * A campaign that is not a campaign token (helpers/links), or an unknown store, goes home.
 */
export async function GET(_request: Request, {params}: {params: Promise<{campaign: string; store: string}>}) {
  const {campaign, store} = await params
  const url = !isCampaign(campaign)
    ? undefined
    : store === 'ios'
      ? appStoreCampaignUrl(campaign)
      : store === 'android'
        ? playStoreCampaignUrl(campaign)
        : undefined

  return url ? goTo(url) : goHome()
}
