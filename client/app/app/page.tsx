import {APP_STORE_URL, SHOW_APP, TESTFLIGHT_URL} from '@/helpers/links'
import dayjs from 'dayjs'
import type {Metadata, Viewport} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import styles from './landing.module.css'

export const metadata: Metadata = {
  title: 'The iPhone App',
  description:
    'The whole Bible in a year, the Psalms three times, or Proverbs every month - with the King James Version built in. Free, ad-free, and it works offline.',
}

/**
 * Safari tints the status bar, and the space around its floating bar, with the page's
 * theme color and background. The site's are lavender and white; this page is dark.
 */
export const viewport: Viewport = {themeColor: '#1a1724'}

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

const Phone = ({shot, className}: {shot: keyof typeof shots; className?: string}) => {
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

/** The App Store badge once the app is there, and TestFlight until it is. */
const GetTheApp = () =>
  APP_STORE_URL ? (
    <a className={`${styles.btn} ${styles.primary}`} href={APP_STORE_URL}>
      <AppleLogo />
      <span className={styles.badgeText}>
        <small>Download on the</small>
        <span>App Store</span>
      </span>
    </a>
  ) : (
    <a className={`${styles.btn} ${styles.primary}`} href={TESTFLIGHT_URL}>
      <AppleLogo />
      <span className={styles.badgeText}>
        <small>Try it now on</small>
        <span>TestFlight</span>
      </span>
    </a>
  )

const AppleLogo = () => (
  <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M223.3 169.6a8 8 0 0 0-4.7-4.6 44 44 0 0 1 3.4-80.3 8 8 0 0 0 2-12.7c-1-1-22.2-21.2-55.2-21.2-13.4 0-24.6 4.8-33.4 9.1-4.1 2-7.9 3.9-11.4 4.9-3.5-1-7.3-2.9-11.4-4.9C104 55.6 92.8 50.8 79.4 50.8 44.6 50.8 16 84.5 16 128c0 25 9.4 53.2 25.7 77.4 15.7 23.3 33.6 36.6 49.1 36.6 9.8 0 16.9-3.4 23.1-6.4 5.4-2.6 10.1-4.9 14.1-4.9s8.7 2.3 14.1 4.9c6.2 3 13.3 6.4 23.1 6.4 27.9 0 56-42.7 60.1-70.4a8 8 0 0 0-2-2ZM144 48a40 40 0 0 0 40-40 8 8 0 0 0-16 0 24 24 0 0 1-24 24 8 8 0 0 0 0 16Z" />
  </svg>
)

const steps = [
  {
    title: "Open the app, and today's reading is there.",
    prose:
      'Two chapters of the Old Testament and one of the New, or three and two on Sundays - the same chapters everyone reading along reads today, in the app and on this website.',
  },
  {
    title: 'Read it right there.',
    prose:
      'The King James Version is built in: set as it is printed, the words of Jesus in red, at the size, spacing and colors you choose. It works on a plane and in a church basement.',
  },
  {
    title: 'Mark the day read.',
    prose:
      'At the foot of the last chapter. See how far through the year you are, and get a reminder each morning with the chapters to read.',
  },
  {
    title: 'Watch the chapters fill in.',
    prose:
      'All 1,189 chapters of the Bible in a grid, filled in as you read them, whatever the plan and whatever the year.',
  },
]

const plans = [
  {
    title: 'The Bible Plan',
    prose:
      'The Old and New Testaments side by side, each from the beginning. The New Testament is finished in August, and the Old takes its place for the rest of the year.',
  },
  {
    title: 'The Psalms Plan',
    prose:
      'All 150 Psalms, three times a year: one a day on weekdays and two on weekends, with Psalm 119 in four parts.',
  },
  {
    title: 'The Proverbs Plan',
    prose: 'All 31 chapters of Proverbs, every month: one a day, doubling up at the end of a short month.',
  },
]

export default function AppLanding() {
  if (!SHOW_APP) notFound()

  const year = dayjs().year()

  return (
    <div className={styles.page}>
      <nav className={styles.nav} aria-label="Main">
        <Link className={styles.brand} href="/">
          <img src="/images/logo-white.svg" alt="" width={26} height={22} />
          Read Your Bible Through
        </Link>
        <Link href="/">Read on the web</Link>
        <Link href="/support">Support</Link>
        <Link href="/privacy">Privacy</Link>
        <a className={`${styles.btn} ${styles.primary} ${styles.navButton}`} href={APP_STORE_URL ?? TESTFLIGHT_URL}>
          Get the app
        </a>
      </nav>

      <main className={styles.shell}>
        <section className={`${styles.split} ${styles.hero}`}>
          <div className={styles.stack} style={{gap: 28, maxWidth: 560}}>
            <h1 className={styles.heroTitle}>
              <span>The whole Bible</span>
              <span>
                in <em>a year</em>.
              </span>
            </h1>
            <p className={styles.lede}>
              Every day of the year has its own reading. Open the app in the morning and today&rsquo;s is waiting - and
              by the end of December you will have read the whole Bible.
            </p>
            <div className={styles.actions}>
              <GetTheApp />
              <Link className={`${styles.btn} ${styles.ghost}`} href="/">
                Read on the web →
              </Link>
            </div>
            <p className={styles.fine}>
              Free, and the app has no ads and no tracking. iPhone for now.
              {!APP_STORE_URL && ' On the App Store soon - until then, TestFlight installs it from the link above.'}
            </p>
          </div>

          <div className={styles.heroDevices}>
            <div className={styles.glow} />
            <div className={styles.heroStage}>
              <Phone shot="today" className={styles.back} />
              <Phone shot="bible" className={styles.front} />
            </div>
          </div>
        </section>

        <div className={styles.rule} />

        <section className={`${styles.section} ${styles.split}`}>
          <div className={styles.stack}>
            <h2 className={styles.kicker} style={{marginBottom: 24}}>
              How it works
            </h2>
            {steps.map((step, index) => (
              <div key={step.title}>
                {index > 0 && <div className={styles.ruleSoft} />}
                <div className={styles.stepRow}>
                  <p className={styles.num} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className={styles.heading}>{step.title}</h3>
                  <p className={styles.prose}>{step.prose}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.single}>
            <Phone shot="chapters" />
          </div>
        </section>

        <div className={styles.rule} />

        <section className={styles.section}>
          <h2 className={styles.kicker} style={{marginBottom: 20}}>
            Three reading plans
          </h2>
          <div className={styles.cols}>
            {plans.map((plan) => (
              <div key={plan.title} className={styles.stack} style={{gap: 10}}>
                <h3 className={styles.heading}>{plan.title}</h3>
                <p className={styles.prose}>{plan.prose}</p>
              </div>
            ))}
          </div>
          <p className={styles.note} style={{marginTop: 36}}>
            The same plans as this website, chapter for chapter - your church, your family and your friends are on the
            same page.
          </p>
        </section>

        <div className={styles.rule} />

        <section className={styles.section}>
          <h2 className={styles.kicker} style={{marginBottom: 20}}>
            What the app does not do
          </h2>
          <div className={styles.cols}>
            <div className={styles.stack} style={{gap: 10}}>
              <h3 className={styles.heading}>No ads, no tracking.</h3>
              <p className={styles.prose}>No analytics in the app, and nothing sold to anybody. It is free.</p>
            </div>
            <div className={styles.stack} style={{gap: 10}}>
              <h3 className={styles.heading}>No account needed.</h3>
              <p className={styles.prose}>
                Without one, everything stays on your phone. With one, it follows you - and you can delete it from
                inside the app.
              </p>
            </div>
            <div className={styles.stack} style={{gap: 10}}>
              <h3 className={styles.heading}>No signal needed.</h3>
              <p className={styles.prose}>
                The plans, the Bible and everything you mark are on your phone first, and sync when you are back online.
              </p>
            </div>
          </div>
          <p className={styles.note} style={{marginTop: 36}}>
            Set out in full in the <Link href="/privacy">privacy policy</Link>.
          </p>
        </section>
      </main>

      <section className={styles.band}>
        <div className={`${styles.shell} ${styles.bandInner}`}>
          <div className={styles.stack} style={{gap: 14}}>
            <h2 className={styles.bandTitle}>Already reading on this website?</h2>
            <p className={styles.lede}>
              Sign in to the app with the same Apple or Google account, and the days you have marked here come with you.
              Mark one on your phone, and it is marked here too.
            </p>
          </div>
          <div className={styles.actions}>
            <a className={`${styles.btn} ${styles.pill}`} href={APP_STORE_URL ?? TESTFLIGHT_URL}>
              Get the app
            </a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <img src="/images/logo-white.svg" alt="" width={28} height={24} />
        <span className={styles.colophon}>
          <span>
            A ministry of <a href="https://cbcwoodbridge.org">Central Baptist Church</a>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            © 2022–{year} <a href="https://candeegenerations.com">Candee Generations</a>
          </span>
        </span>
        <nav className={styles.footerLinks} aria-label="Footer">
          <Link href="/support">Support</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </footer>
    </div>
  )
}
