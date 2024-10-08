// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export function pageview(url: URL) {
  // eslint-disable-next-line no-undef
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

  if (GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

type GTagEvent = {
  action: string
  category: string
  label?: string
  value?: number
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export function gtagEvent({action, category, label, value}: GTagEvent) {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
