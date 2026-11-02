import {APP_STORE_URL, PLAY_STORE_URL, TESTFLIGHT_URL} from '@/helpers/links'
import dayjs from 'dayjs'
import Link from 'next/link'
import type {ReactNode} from 'react'

import styles from './landing.module.css'

/**
 * What the app landing page and the pages for churches and colleges share: the bar, the
 * phones, the store badges and the footer. Each page is its own sections between them.
 */

/**
 * The screenshots in the phones, from `public/images/app/`: 786 pixels wide, the shape of an
 * iPhone's screen - three times the widest frame here, which keeps the app's text sharp on
 * a phone's own screen. A shot without `src` shows a placeholder saying which goes there.
 */
const shots: Record<'today' | 'bible' | 'chapters', {src?: string; title: string; alt: string}> = {
  today: {
    src: '/images/app/today.webp',
    title: 'Today',
    alt: "The Today page for Monday, September 14: the Old Testament's Psalms 105-107, the New Testament finished, the day marked read, and the month's calendar.",
  },
  bible: {
    src: '/images/app/bible.webp',
    title: 'The Bible',
    alt: 'Psalm 105 in the King James Version built into the app, a verse to a line, with the LORD in small capitals.',
  },
  chapters: {
    src: '/images/app/chapters.webp',
    title: 'Chapters',
    alt: 'The Chapters page: 60% of the Bible read - 725 chapters, 37 books finished, a best streak of 15 days - above the grid of every chapter.',
  },
}

export const Phone = ({shot, className}: {shot: keyof typeof shots; className?: string}) => {
  const {src, title, alt} = shots[shot]

  return (
    <div className={`${styles.phone} ${className ?? ''}`}>
      <div className={styles.screen}>
        {src ? (
          <img src={src} width={786} height={1704} alt={alt} />
        ) : (
          <div className={styles.placeholder} role="img" aria-label={alt}>
            <strong>{title}</strong>
            <span>Screenshot, 786 × 1704</span>
          </div>
        )}
      </div>
    </div>
  )
}

/** Where a "Get the app" button goes: the badges, which say which store is whose. */
export const GET_THE_APP = '/app#get'

/**
 * Apple's own App Store badge, or a TestFlight button while `APP_STORE_ID` is unset, and
 * Google's Play badge once `PLAY_STORE_ID` is set - see helpers/links. Both badges are their
 * owners' files, unmodified, as Apple's marketing guidelines and Google's badge guidelines
 * require: never redrawn.
 */
export const StoreBadges = ({id, children}: {id?: string; children?: ReactNode}) => (
  <div className={styles.actions} id={id}>
    {APP_STORE_URL ? (
      <a className={styles.storeBadge} href={APP_STORE_URL}>
        <img src="/images/app-store-badge.svg" alt="Download on the App Store" width={144} height={48} />
      </a>
    ) : (
      <a className={`${styles.btn} ${styles.primary}`} href={TESTFLIGHT_URL}>
        <AppleLogo />
        <span className={styles.badgeText}>
          <small>Try it now on</small>
          <span>TestFlight</span>
        </span>
      </a>
    )}
    {PLAY_STORE_URL && (
      <a className={`${styles.storeBadge} ${styles.playBadge}`} href={PLAY_STORE_URL}>
        <img src="/images/google-play-badge.png" alt="Get it on Google Play" width={186} height={72} />
      </a>
    )}
    {children}
  </div>
)

/** The devices the app is for, as the fine print under a hero says them. */
export const DEVICES = PLAY_STORE_URL ? 'iPhone, iPad and Android' : 'iPhone and iPad'

const AppleLogo = () => (
  <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M223.3 169.6a8 8 0 0 0-4.7-4.6 44 44 0 0 1 3.4-80.3 8 8 0 0 0 2-12.7c-1-1-22.2-21.2-55.2-21.2-13.4 0-24.6 4.8-33.4 9.1-4.1 2-7.9 3.9-11.4 4.9-3.5-1-7.3-2.9-11.4-4.9C104 55.6 92.8 50.8 79.4 50.8 44.6 50.8 16 84.5 16 128c0 25 9.4 53.2 25.7 77.4 15.7 23.3 33.6 36.6 49.1 36.6 9.8 0 16.9-3.4 23.1-6.4 5.4-2.6 10.1-4.9 14.1-4.9s8.7 2.3 14.1 4.9c6.2 3 13.3 6.4 23.1 6.4 27.9 0 56-42.7 60.1-70.4a8 8 0 0 0-2-2ZM144 48a40 40 0 0 0 40-40 8 8 0 0 0-16 0 24 24 0 0 1-24 24 8 8 0 0 0 0 16Z" />
  </svg>
)

export const Nav = () => (
  <nav className={styles.nav} aria-label="Main">
    <Link className={styles.brand} href="/">
      <img src="/images/logo-white.svg" alt="" width={26} height={22} />
      Read Your Bible Through
    </Link>
    <Link href="/">Read on the web</Link>
    <Link href="/support">Support</Link>
    <Link href="/privacy">Privacy</Link>
    <Link className={`${styles.btn} ${styles.primary} ${styles.navButton}`} href={GET_THE_APP}>
      Get the app
    </Link>
  </nav>
)

/** The pages for each kind of reader, linked from every footer, as Lockstep's are. */
const audiences = [
  {href: '/for/churches', title: 'Churches'},
  {href: '/for/colleges', title: 'Colleges'},
]

export const Footer = ({current}: {current?: string}) => (
  <footer className={styles.footer}>
    <nav className={styles.audiences} aria-label="Read Your Bible Through for">
      <span>Read Your Bible Through for</span>
      {audiences.map((audience) => (
        <Link key={audience.href} href={audience.href} aria-current={audience.href === current ? 'page' : undefined}>
          {audience.title}
        </Link>
      ))}
    </nav>
    <img src="/images/logo-white.svg" alt="" width={28} height={24} />
    <span className={styles.colophon}>
      <span>
        A ministry of <a href="https://cbcwoodbridge.org">Central Baptist Church</a>
      </span>
      <span aria-hidden="true">·</span>
      <span>
        © 2022–{dayjs().year()} <a href="https://candeegenerations.com">Candee Generations</a>
      </span>
    </span>
    <nav className={styles.footerLinks} aria-label="Footer">
      <Link href="/support">Support</Link>
      <Link href="/privacy">Privacy</Link>
      <Link href="/terms">Terms</Link>
    </nav>
    {(APP_STORE_URL || PLAY_STORE_URL) && (
      <p className={styles.trademarks}>
        {APP_STORE_URL &&
          'Apple, the Apple logo, iPhone and iPad are trademarks of Apple Inc., registered in the U.S. and other countries. App Store is a service mark of Apple Inc. '}
        {PLAY_STORE_URL && 'Google Play and the Google Play logo are trademarks of Google LLC.'}
      </p>
    )}
  </footer>
)
