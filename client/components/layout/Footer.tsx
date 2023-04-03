import dayjs from 'dayjs'
import Link from 'next/link'
import {gtagEvent} from '../../libs/gtag'

const Footer = () => {
  const year = dayjs().format('YYYY')

  return (
    <>
      <div className="relative border border-secondary-300 mt-24 mb-12" />

      <div className="relative flex items-center content-between lg:pb-20 pb-10 lg:flex-row flex-col text-secondary-500">
        <div className="flex-grow pb-3 lg:pb-0 text-center lg:text-left">
          A ministry of{' '}
          <a
            href="https://cbcwoodbridge.org"
            target="_blank"
            onClick={() =>
              gtagEvent({
                action: 'footer__central_baptist_church__link',
                category: 'engagement',
                label: 'click_event',
              })
            }
          >
            Central Baptist Church
          </a>
          <br />
          <Link
            href="/privacy"
            onClick={() =>
              gtagEvent({
                action: 'privacy__footer__link',
                category: 'engagement',
                label: 'click_event',
              })
            }
          >
            Privacy Policy
          </Link>{' '}
          |{' '}
          <Link
            href="/terms"
            onClick={() =>
              gtagEvent({
                action: 'terms__footer__link',
                category: 'engagement',
                label: 'click_event',
              })
            }
          >
            Terms of Service
          </Link>{' '}
          |{' '}
          <Link
            href="/data"
            onClick={() =>
              gtagEvent({
                action: 'data__footer__link',
                category: 'engagement',
                label: 'click_event',
              })
            }
          >
            Data Deletion
          </Link>
        </div>

        <div className="flex flex-grow-0">
          &copy; 2022{year !== '2022' && ` - ${year}`}&nbsp;
          <a
            href="https://candeegenerations.com?ref=readyourbiblethrough.com"
            target="_blank"
            onClick={() =>
              gtagEvent({
                action: 'footer__candee_generations__link',
                category: 'engagement',
                label: 'click_event',
              })
            }
          >
            Candee Generations
          </a>
        </div>
      </div>
    </>
  )
}

export default Footer
