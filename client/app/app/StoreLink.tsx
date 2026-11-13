'use client'

import {appStoreCampaignUrl, isCampaign, playStoreCampaignUrl} from '@/helpers/links'
import {useSearchParams} from 'next/navigation'
import {type ReactNode, Suspense} from 'react'

type Props = {store: 'ios' | 'android'; href: string; className?: string; children: ReactNode}

/**
 * A store badge's link that carries the page's campaign on to the store: on
 * /app?ct=meta-m1-static, the App Store badge has App Store Connect's campaign tokens and the
 * Play badge the matching install referrer, so each store counts that ad's installs.
 *
 * This is how Meta's ads reach a store. A Traffic ad may not link to a store, nor to a link that
 * redirects to one (app/go), so an ad links to this page and the reader taps a badge. Without a
 * campaign, or with one that is not a campaign token, the badge links to the store as it is.
 */
export const StoreLink = (props: Props) => (
  <Suspense fallback={<Plain {...props} />}>
    <WithCampaign {...props} />
  </Suspense>
)

const Plain = ({href, className, children}: Props) => (
  <a className={className} href={href}>
    {children}
  </a>
)

const WithCampaign = (props: Props) => {
  const campaign = useSearchParams().get('ct')
  const url = isCampaign(campaign)
    ? props.store === 'ios'
      ? appStoreCampaignUrl(campaign)
      : playStoreCampaignUrl(campaign)
    : undefined

  return <Plain {...props} href={url ?? props.href} />
}
