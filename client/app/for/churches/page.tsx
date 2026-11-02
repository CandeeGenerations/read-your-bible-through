import {APP_PAGE_URL} from '@/helpers/links'
import type {Metadata, Viewport} from 'next'
import Link from 'next/link'

import AudiencePage, {type Audience} from '../AudiencePage'

const description =
  'The whole church on the same chapters every day of the year, with the King James Version built in. Free, with no ads.'

export const metadata: Metadata = {
  title: 'For Churches',
  description,
  openGraph: {title: 'Read Your Bible Through for churches', description},
}

export const viewport: Viewport = {themeColor: '#1a1724'}

const churches: Audience = {
  path: '/for/churches',
  kicker: 'Read Your Bible Through for churches',
  title: [
    'One church,',
    <>
      one <em>reading</em>.
    </>,
  ],
  lede: 'Give your congregation the same chapters every day of the year. Everyone opens the app in the morning and reads what the rest of the church is reading - and by December, the church has read the whole Bible together.',
  ideas: [
    {
      title: 'Read the Bible through as a church',
      prose:
        'Announce it from the pulpit in January, or any Sunday after. Whoever starts later starts on today’s reading with everyone else, and catches up on the rest as they can.',
      plan: 'The Bible Plan',
    },
    {
      title: 'Teach from the week’s chapters',
      prose:
        'The whole church read the same chapters this week, so a Wednesday night Bible study or a Sunday school lesson can start where everybody already is.',
      plan: 'The Bible Plan',
    },
    {
      title: 'Proverbs with the youth group',
      prose:
        'All 31 chapters every month, one a day. The teens read the same chapter on the same morning, and talk about it on Wednesday night.',
      plan: 'The Proverbs Plan',
    },
  ],
  steps: [
    {
      title: 'Tell the church.',
      prose: (
        <>
          Put <Link href={APP_PAGE_URL}>rybt.app</Link> in the bulletin or on the screen before the service. Nothing to
          set up and nobody to sign up - the plan is the same for everyone already.
        </>
      ),
    },
    {
      title: 'Everyone reads the same chapters.',
      prose:
        'Each morning the app has the day’s reading, the King James Version built in and a reminder at the time each person picks. It works without a signal, too.',
    },
    {
      title: 'Talk about it on Sunday.',
      prose: 'At the door, in the hallway, over lunch: everybody read Leviticus this week. Ask what stood out.',
    },
  ],
  questions: [
    {
      question: 'Does it cost the church anything?',
      answer:
        'No. The app and this website are free for everyone, with no ads and no in-app purchases. There is no church account to set up and nothing to pay for.',
    },
    {
      question: 'Which Bible does it use?',
      answer:
        'The King James Version, built into the app. A word that has changed its meaning since 1611 is dotted, and a tap shows it in Webster’s 1828 dictionary.',
    },
    {
      question: 'What about members without a smartphone?',
      answer: (
        <>
          The same readings are on <Link href="/">this website</Link>, the same chapters on the same day, on any
          computer. Anyone can read along from a printed Bible with the day’s chapters in front of them.
        </>
      ),
    },
    {
      question: 'Can the church see who is keeping up?',
      answer:
        'No. There are no groups and no leader’s view. What each person marks stays on their own phone, or in their own account if they sign in, and nobody else sees it.',
    },
    {
      question: 'Who makes it?',
      answer: (
        <>
          Read Your Bible Through is a ministry of <a href="https://cbcwoodbridge.org">Central Baptist Church</a>. It
          began as this website in 2022, and the app followed in 2026.
        </>
      ),
    },
  ],
  band: {
    title: 'Start it this Sunday.',
    prose: 'Tell the church on Sunday, and on Monday morning everyone opens to the same chapters.',
  },
}

export default function ForChurches() {
  return <AudiencePage audience={churches} />
}
