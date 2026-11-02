import {APP_PAGE_URL, SHOW_APP} from '@/helpers/links'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {ReactNode} from 'react'

import styles from '../app/landing.module.css'
import {DEVICES, Footer, GET_THE_APP, Nav, Phone, StoreBadges} from '../app/parts'

/**
 * A page for one kind of reader - a church, a college - laid out as Lockstep's /for/ pages
 * are (locksteptracker.app/for/churches.html): the hero, ideas to run, how it works beside a
 * phone, the questions an organizer asks, and a band at the foot. Each page is its words.
 */
export type Audience = {
  path: string
  kicker: string
  title: [string, ReactNode]
  lede: string
  ideas: {title: string; prose: string; plan: string}[]
  steps: {title: string; prose: ReactNode}[]
  questions: {question: string; answer: ReactNode}[]
  band: {title: string; prose: string}
}

export default function AudiencePage({audience}: {audience: Audience}) {
  if (!SHOW_APP) notFound()

  return (
    <div className={styles.page}>
      <Nav />

      <main className={styles.shell}>
        <section className={`${styles.split} ${styles.hero}`}>
          <div className={styles.stack} style={{gap: 28, maxWidth: 560}}>
            <span className={styles.kicker}>{audience.kicker}</span>
            <h1 className={styles.heroTitle}>
              <span>{audience.title[0]}</span>
              <span>{audience.title[1]}</span>
            </h1>
            <p className={styles.lede}>{audience.lede}</p>
            <StoreBadges />
            <p className={styles.fine}>
              Free for everyone, with no ads and nothing to buy. {DEVICES} - and for anyone without a smartphone, the
              same readings are on <Link href="/">this website</Link>.
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

        <section className={`${styles.section} ${styles.stack}`} style={{gap: 28}}>
          <h2 className={styles.kicker}>Ideas to run</h2>
          <div className={styles.ideas}>
            {audience.ideas.map((idea) => (
              <div key={idea.title} className={styles.idea}>
                <h3 className={styles.heading}>{idea.title}</h3>
                <p className={styles.prose}>{idea.prose}</p>
                <p className={styles.plan}>{idea.plan}</p>
              </div>
            ))}
          </div>
          <p className={styles.note}>
            Every plan runs by the date, the same for everyone, in the app and on this website.{' '}
            <Link href={APP_PAGE_URL}>See the three plans</Link>.
          </p>
        </section>

        <div className={styles.rule} />

        <section className={`${styles.section} ${styles.split}`}>
          <div className={styles.stack}>
            <h2 className={styles.kicker} style={{marginBottom: 24}}>
              How it works
            </h2>
            {audience.steps.map((step, index) => (
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
          <h2 className={styles.kicker} style={{marginBottom: 8}}>
            Questions
          </h2>
          <div className={styles.questions}>
            {audience.questions.map((qa) => (
              <div key={qa.question} className={styles.qa}>
                <h3 className={styles.heading}>{qa.question}</h3>
                <p className={styles.prose}>{qa.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <section className={styles.band}>
        <div className={`${styles.shell} ${styles.bandInner}`}>
          <div className={styles.stack} style={{gap: 14}}>
            <h2 className={styles.bandTitle}>{audience.band.title}</h2>
            <p className={styles.lede}>{audience.band.prose}</p>
          </div>
          <div className={styles.actions}>
            <Link className={`${styles.btn} ${styles.pill}`} href={GET_THE_APP}>
              Get the app
            </Link>
          </div>
        </div>
      </section>

      <Footer current={audience.path} />
    </div>
  )
}
