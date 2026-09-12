'use client'

import Link from 'next/link'

import InfoPage, {Email, List, Paragraph, Section} from '../../components/InfoPage'

export default function Privacy() {
  return (
    <InfoPage title="Privacy Policy" eventPrefix="privacy" lastUpdated="11 September 2026">
      <Paragraph>
        Read Your Bible Through is a ministry of <a href="https://cbcwoodbridge.org">Central Baptist Church</a>, built
        and run by <a href="https://candeegenerations.com">Candee Generations</a>. This policy covers the website at
        readyourbiblethrough.com and the Read Your Bible Through app for iPhone. “We” and “us” mean the people who run
        them.
      </Paragraph>

      <Section title="The short version">
        <List>
          <li>You can follow every reading plan without an account, on the website or in the app.</li>
          <li>In the app, anything you do without signing in stays on your iPhone.</li>
          <li>
            If you sign in, we keep your name, your email address and the readings you’ve marked as read, so we can show
            you your progress.
          </li>
          <li>We never sell your information, show you ads, or share your information for marketing.</li>
          <li>The app has no advertising or analytics, and it doesn’t track you.</li>
          <li>You can delete your account and your information at any time, in the app or by asking us.</li>
        </List>
      </Section>

      <Section title="Using the app without an account">
        <Paragraph>
          The reading plans are built into the app. The plan you last chose, the days and chapters you mark as read and
          your settings are stored on your iPhone and are not sent to us. Deleting the app deletes them.
        </Paragraph>
      </Section>

      <Section title="If you sign in">
        <Paragraph>
          Signing in with Apple or Google, where it’s offered, saves your progress to an account so it follows you
          between the website and the app. When you sign in, we receive and store:
        </Paragraph>

        <List>
          <li>
            <strong>Your name and email address</strong>, from Apple or Google. If you use Sign in with Apple and choose
            to hide your email, Apple gives us a private relay address instead of your real one.
          </li>
          <li>
            <strong>Which services you sign in with</strong>, and the account ID each gives us, so we recognize you next
            time. If you add a second way to sign in, such as Sign in with Apple beside Google, we store its account ID
            and the email address it gives us too.
          </li>
          <li>
            <strong>A token from Apple</strong>, if you use Sign in with Apple, which we use only to tell Apple to stop
            Sign in with Apple for Read Your Bible Through when you remove it or delete your account.
          </li>
          <li>
            <strong>Your reading progress</strong>: which days’ readings, and which chapters, you’ve marked as read or
            unread, and when.
          </li>
          <li>
            <strong>Your settings</strong>, such as whether marking a day as read also marks its chapters.
          </li>
        </List>

        <Paragraph>
          We never see your Apple or Google password. We use this information only to sign you in, save your progress
          and show it back to you.
        </Paragraph>
      </Section>

      <Section title="Daily reminders">
        <Paragraph>
          If you turn on the daily reminder in the app, your iPhone schedules it. The day’s reading in it is worked out
          on your iPhone. We don’t send reminders from a server, and we don’t know whether you’ve turned them on. You
          can turn them off in the app or in your iPhone’s Settings.
        </Paragraph>
      </Section>

      <Section title="The website">
        <Paragraph>
          When you sign in on the website, a cookie keeps you signed in. The website also uses Google Analytics to count
          visits and see which pages and buttons people use. Google Analytics sets its own cookies and receives
          information such as your IP address, your browser and device type, and the pages you view. You can opt out
          with <a href="https://tools.google.com/dlpage/gaoptout">Google’s opt-out browser add-on</a> or by blocking
          cookies in your browser. The app doesn’t use Google Analytics.
        </Paragraph>
      </Section>

      <Section title="Services we rely on">
        <Paragraph>
          We share information with other services only as far as we need to in order to run Read Your Bible Through,
          and we only use providers that commit to protecting it at least as well as this policy does.
        </Paragraph>

        <List>
          <li>
            <strong>Apple and Google</strong> handle signing in. Their own privacy policies cover what they do.
          </li>
          <li>
            <strong>BibleGateway</strong>: tapping a passage opens it on biblegateway.com. We tell BibleGateway which
            passage to show and nothing else. BibleGateway’s privacy policy covers what happens on their site.
          </li>
          <li>
            <strong>Hosting</strong>: the website runs on Netlify and our server runs on Microsoft Azure. They store and
            process data for us only so the service can run. Like most online services, they keep technical logs, such
            as IP addresses and error messages, for a short time to keep things running and secure.
          </li>
          <li>
            <strong>Google Analytics</strong>, on the website only, as described above.
          </li>
          <li>
            <strong>Apple crash reports</strong>: if you’ve chosen to share analytics with app developers in your
            iPhone’s Settings, Apple may send us crash reports and anonymous usage statistics. Apple controls this. You
            can turn it off under Settings › Privacy &amp; Security › Analytics &amp; Improvements.
          </li>
        </List>
      </Section>

      <Section title="What we don’t do">
        <List>
          <li>We don’t sell or rent your information.</li>
          <li>We don’t show ads.</li>
          <li>We don’t share your information with anyone for marketing.</li>
          <li>The app doesn’t track you across other companies’ apps or websites.</li>
          <li>We disclose information only when the law requires us to.</li>
        </List>
      </Section>

      <Section title="How long we keep it">
        <Paragraph>
          We keep your account and your reading progress, including progress from past years, for as long as you have an
          account, so your history is there when you come back. When you delete your account in the app, we delete it
          and all of your reading progress straight away. When you ask us to by email, we do it within 30 days.
        </Paragraph>
      </Section>

      <Section title="Your choices">
        <List>
          <li>
            <strong>Delete your data.</strong> If you haven’t signed in, delete the app. If you have, delete your
            account in the app: tap the person icon at the top right, then Delete Account. Or follow the steps on our{' '}
            <Link href="/data">Data Deletion</Link> page.
          </li>
          <li>
            <strong>See or correct your data.</strong> Email us and we’ll send you a copy of what we hold about you, or
            fix anything that’s wrong.
          </li>
          <li>
            <strong>Stop using Apple or Google sign-in.</strong> If your account has both, you can remove either one in
            the app, under the person icon at the top right. For Apple, you can also open your iPhone’s Settings, tap
            your name, then find Read Your Bible Through under Sign in with Apple. For Google, remove it at{' '}
            <a href="https://myaccount.google.com/connections">myaccount.google.com/connections</a>. This stops us
            receiving your sign-in, but doesn’t delete what we already hold. To do that, ask us to delete your account.
          </li>
        </List>
      </Section>

      <Section title="Keeping it safe">
        <Paragraph>
          Information travels between the app or website and our server over encrypted (HTTPS) connections, and only the
          people who run Read Your Bible Through can reach the database. No system is perfectly secure, but we take
          reasonable care to protect what you trust us with.
        </Paragraph>
      </Section>

      <Section title="Children">
        <Paragraph>
          Anyone can follow the reading plans without an account. We don’t knowingly collect personal information from
          children under 13. If you believe a child under 13 has signed in, contact us and we’ll delete their account.
        </Paragraph>
      </Section>

      <Section title="Changes to this policy">
        <Paragraph>If we change this policy, we’ll post the new version here and update the date below.</Paragraph>
      </Section>

      <Section title="Contact us">
        <Paragraph>
          If you have questions about this policy or your information, email us at <Email subject="Privacy" />.
        </Paragraph>
      </Section>
    </InfoPage>
  )
}
