import {APP_STORE_URL, PLAY_STORE_URL, SHOW_APP} from '@/helpers/links'
import type {Metadata, Viewport} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import styles from './landing.module.css'
import {Footer, GET_THE_APP, Nav, Phone, StoreBadges} from './parts'

export const metadata: Metadata = {
  title: 'The App',
  description:
    'The whole Bible in a year, the Psalms three times, or Proverbs every month - with the King James Version built in. Free, ad-free, and it works offline.',
}

/**
 * Safari tints the status bar, and the space around its floating bar, with the page's
 * theme color and background. The site's are lavender and white; this page is dark.
 */
export const viewport: Viewport = {themeColor: '#1a1724'}

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

  return (
    <div className={styles.page}>
      <Nav />

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
            <StoreBadges id="get">
              <Link className={`${styles.btn} ${styles.ghost}`} href="/">
                Read on the web →
              </Link>
            </StoreBadges>
            <p className={styles.fine}>
              Free, and the app has no ads and no tracking.{' '}
              {PLAY_STORE_URL
                ? 'iPhone, iPad and Android phones and tablets, with widgets for your home screen.'
                : 'iPhone and iPad, with widgets for your Home Screen and Lock Screen.'}
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
            same page. Reading with a congregation or a campus? See the app{' '}
            <Link href="/for/churches">for churches</Link> and <Link href="/for/colleges">for colleges</Link>.
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
              <p className={styles.prose}>
                No ad networks, no analytics companies, and nothing sold to anybody. It is free. We count how signed-in
                readers use it, on our own server, and share that with no one.
              </p>
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
              Mark one on your phone, and it is marked here too
              {PLAY_STORE_URL && ' - and on your other phones and tablets, iPhone or Android'}.
            </p>
          </div>
          <div className={styles.actions}>
            <Link className={`${styles.btn} ${styles.pill}`} href={GET_THE_APP}>
              Get the app
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
