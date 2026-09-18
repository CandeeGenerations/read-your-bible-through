'use client'

import Link from 'next/link'
import React from 'react'

import InfoPage, {Email, List, Paragraph, Section} from '../../components/InfoPage'

const Question = ({children, question}: {children: React.ReactNode; question: string}) => (
  <div className="mt-8">
    <h3 className="text-xl font-bold text-secondary-700">{question}</h3>
    {children}
  </div>
)

export default function Support() {
  return (
    <InfoPage title="Support" eventPrefix="support" lastUpdated="11 September 2026">
      <Paragraph>
        Questions, problems or ideas for the Read Your Bible Through website or app? We’d love to hear from you.
      </Paragraph>

      <Section title="Contact us">
        <Paragraph>
          Email <Email subject="Read Your Bible Through Support" /> and we’ll get back to you as soon as we can.
        </Paragraph>

        <Paragraph>If something isn’t working, it helps us to know:</Paragraph>

        <List>
          <li>whether you’re using the website or the app</li>
          <li>for the app, your iPhone or iPad model and iOS version</li>
          <li>which reading plan and day you were looking at</li>
          <li>what happened, and what you expected to happen</li>
        </List>
      </Section>

      <Section title="Common questions">
        <Question question="What are the reading plans?">
          <List>
            <li>
              <strong>The Bible</strong>: the whole Bible in a year, reading the Old and New Testaments side by side
              from January 1st. Monday to Saturday, read two Old Testament chapters and one New Testament chapter. On
              Sunday, read three and two. Once the New Testament is finished in mid-August, its chapters go to the Old
              Testament.
            </li>
            <li>
              <strong>Psalms</strong>: all 150 Psalms three times a year. Read one Psalm on weekdays and two on Saturday
              and Sunday. Psalm 119 is split into four readings.
            </li>
            <li>
              <strong>Proverbs</strong>: all 31 chapters of Proverbs every month, one a day, doubling up at the end of a
              short month.
            </li>
          </List>
          <Paragraph>
            Everyone reads the same thing on the same day, and every plan starts over on January 1st.
          </Paragraph>
        </Question>

        <Question question="Is it free?">
          <Paragraph>Yes. The website and the app are free, with no ads and no in-app purchases.</Paragraph>
        </Question>

        <Question question="Do I need an account?">
          <Paragraph>
            No. Anyone can follow the reading plans without signing in. Signing in saves the readings you’ve marked as
            read to an account.
          </Paragraph>
        </Question>

        <Question question="What if I fall behind?">
          <Paragraph>
            Pick up with today’s reading, and catch up on the days you missed when you can. You can open any day of the
            year from the calendar. In the app, the daily reminder names the first day you haven’t marked read, so it
            picks up where you left off.
          </Paragraph>
        </Question>

        <Question question="Why is there nothing to read at the end of the year?">
          <Paragraph>
            The Bible and Psalms plans finish a little early: the Bible plan two or three days before the end of the
            year, and the Psalms plan around December 23rd. Those last days are a good time to catch up. Both plans are
            365 days long, so in a leap year December 31st has no reading.
          </Paragraph>
        </Question>

        <Question question="Which Bible translation do the readings use?">
          <Paragraph>
            The King James Version. The app has it built in, so a reading opens right in the app. On the website,
            passages open on BibleGateway in the Authorized King James Version (AKJV), the same text.
          </Paragraph>
        </Question>

        <Question question="Does the app work without an internet connection?">
          <Paragraph>
            Yes. The reading plans and the whole King James Version are built into the app, so you can read any day’s
            reading and mark it read with no connection. If you’ve signed in, what you mark offline syncs when you’re
            back online. Only syncing and opening a passage on BibleGateway need a connection.
          </Paragraph>
        </Question>

        <Question question="How do I delete my data?">
          <Paragraph>
            Follow the steps on our <Link href="/data">Data Deletion</Link> page. Our{' '}
            <Link href="/privacy">Privacy Policy</Link> explains what we collect and why.
          </Paragraph>
        </Question>
      </Section>
    </InfoPage>
  )
}
