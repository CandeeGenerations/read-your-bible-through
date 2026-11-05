import {APP_PAGE_URL} from '@/helpers/links'
import type {Viewport} from 'next'
import Link from 'next/link'

import AudiencePage, {type Audience, audienceMetadata} from '../AudiencePage'

const description =
  'Every student on the same chapters every day, with the King James Version built in and nothing to set up. Free, with no ads.'

export const metadata = audienceMetadata(
  'For Colleges',
  'Read Your Bible Through for Christian colleges',
  description,
  '/images/og-colleges.jpg',
  'Read Your Bible Through for Christian colleges - every student, the same chapters. Today’s reading on an iPhone, and the Google Play and App Store badges.',
)

export const viewport: Viewport = {themeColor: '#1a1724'}

const colleges: Audience = {
  path: '/for/colleges',
  kicker: 'Read Your Bible Through for Christian colleges',
  title: [
    'Every student,',
    <>
      the same <em>chapters</em>.
    </>,
  ],
  lede: 'Give your students, faculty and staff the same Bible reading every day. The app has the day’s chapters and the King James Version built in, so a dorm room, a library carrel or the van to a ministry trip is enough.',
  ideas: [
    {
      title: 'A hall that reads together',
      prose:
        'Every room on the hall reads the same chapters each morning, and hall devotions start from them at night. Nobody has to keep a schedule but the calendar.',
      plan: 'The Bible Plan',
    },
    {
      title: 'The Psalms, once a semester',
      prose:
        'All 150 Psalms three times a year - about January to April, May to August, and late August to Christmas. Near enough a spring semester, a summer and a fall.',
      plan: 'The Psalms Plan',
    },
    {
      title: 'Proverbs for the freshman class',
      prose:
        'All 31 chapters every month, one a day - wisdom for the first year away from home, read on the same morning by the whole class.',
      plan: 'The Proverbs Plan',
    },
  ],
  steps: [
    {
      title: 'Share the link.',
      prose: (
        <>
          Put <Link href={APP_PAGE_URL}>rybt.app</Link> on the chapel screen, in the student portal or in the
          orientation packet. There is nothing for the college to set up.
        </>
      ),
    },
    {
      title: 'Each student reads on their own phone.',
      prose:
        'Today’s chapters are waiting each morning, with a reminder at the time they choose. The whole Bible is in the app, so it works with no signal and no data plan.',
    },
    {
      title: 'Their reading goes with them.',
      prose:
        'Signed in with Apple or Google, what they mark follows them to a new phone, a tablet and this website - through graduation and after.',
    },
  ],
  questions: [
    {
      question: 'Is it free for students?',
      answer:
        'Yes. The app and this website are free, with no ads and no in-app purchases. There is no license for the college to buy.',
    },
    {
      question: 'Does the college get any student data?',
      answer: (
        <>
          No. There are no groups and no leader’s view, and nothing goes to an analytics company. What a student marks
          stays on their phone, or in their own account if they sign in, which we who run the app can count but never
          share. The <Link href="/privacy">privacy policy</Link> sets it out.
        </>
      ),
    },
    {
      question: 'Which Bible does it use?',
      answer:
        'The King James Version, built into the app. A word that has changed its meaning since 1611 is dotted, and a tap shows it in Webster’s 1828 dictionary.',
    },
    {
      question: 'What if a student starts in the middle of the year?',
      answer:
        'They start on today’s reading, with everyone else. Any earlier day is a tap away on the calendar, and the morning reminder names the first day they have not marked read.',
    },
  ],
  band: {
    title: 'Start it at the next chapel.',
    prose: 'Put the link on the screen, and every student can be on today’s reading before they leave their seat.',
  },
}

export default function ForColleges() {
  return <AudiencePage audience={colleges} />
}
