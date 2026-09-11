'use client'

import Link from 'next/link'
import React from 'react'

import InfoPage, {Email, List, Paragraph, Section} from '../../components/InfoPage'

export default function Data() {
  return (
    <InfoPage title="Data Deletion" eventPrefix="data" lastUpdated="11 September 2026">
      <Paragraph>
        You can ask us to delete your Read Your Bible Through account and everything saved with it at any time.
      </Paragraph>

      <Section title="If you use the app without an account">
        <Paragraph>
          We don’t have anything to delete. Your reading progress and settings are only on your iPhone, and deleting the
          app removes them.
        </Paragraph>
      </Section>

      <Section title="If you’ve signed in">
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

      <Section title="Questions">
        <Paragraph>
          Our <Link href="/privacy">Privacy Policy</Link> explains what we collect and why. If you have any questions,
          email us at <Email />.
        </Paragraph>
      </Section>
    </InfoPage>
  )
}
