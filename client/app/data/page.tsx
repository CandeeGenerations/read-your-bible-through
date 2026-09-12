'use client'

import Link from 'next/link'
import React from 'react'

import InfoPage, {Email, List, Paragraph, Section} from '../../components/InfoPage'

export default function Data() {
  return (
    <InfoPage title="Data Deletion" eventPrefix="data" lastUpdated="11 September 2026">
      <Paragraph>
        You can delete your Read Your Bible Through account and everything saved with it at any time, in the app or by
        asking us.
      </Paragraph>

      <Section title="Delete your account in the app">
        <List ordered>
          <li>Open Read Your Bible Through on your iPhone.</li>
          <li>Tap the person icon at the top right of the screen. If you’re not signed in, sign in first.</li>
          <li>Tap Delete Account, then Delete Account again to confirm.</li>
        </List>

        <Paragraph>
          Your account, every day and chapter you’ve marked with it, your settings and the ways you sign in are deleted
          from our server straight away, and we ask Apple to stop Sign in with Apple for Read Your Bible Through. Your
          other devices and the website stop syncing with the account. Deleted data can’t be recovered.
        </Paragraph>

        <Paragraph>
          What you’ve marked stays on your iPhone, just as it does when you sign out, until you delete the app.
        </Paragraph>
      </Section>

      <Section title="If you only use the website">
        <List ordered>
          <li>
            Email <Email subject="Data Deletion Request" /> with the subject line “Data Deletion Request”.
          </li>
          <li>
            Tell us the email address on your account and whether you sign in with Apple or Google. If you use Sign in
            with Apple and chose to hide your email, your account’s address ends in @privaterelay.appleid.com. You can
            find it in your iPhone’s Settings under Sign in with Apple.
          </li>
          <li>We may reply to confirm that the account is yours.</li>
          <li>
            Within 30 days, we delete your account and all of your reading progress, and email you when it’s done.
            Deleted data can’t be recovered.
          </li>
        </List>

        <Paragraph>
          If the law requires us to keep any of your information, we’ll tell you what we kept and why.
        </Paragraph>
      </Section>

      <Section title="If you use the app without an account">
        <Paragraph>
          We don’t have anything to delete. Your reading progress and settings are only on your iPhone, and deleting the
          app removes them.
        </Paragraph>
      </Section>

      <Section title="Questions">
        <Paragraph>
          Our <Link href="/privacy">Privacy Policy</Link> explains what we collect and why. If you have any questions,
          email us at <Email />.
        </Paragraph>
      </Section>
    </InfoPage>
  )
}
