'use client'

import {PageType, pages} from '@/helpers/constants'
import Image from 'next/image'
import React from 'react'

import {gtagEvent} from '../../libs/gtag'
import ButtonLink from '../buttonLink'
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '../ui/dialog'

interface ILearnModal {
  // eslint-disable-next-line no-unused-vars
  onChange: (open: boolean) => void
  open: boolean
  page?: PageType
}

const Divider = () => (
  <div className="relative mt-5">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-300" />
    </div>
  </div>
)

const BiblePlanContent = () => (
  <>
    <p className="text-sm text-gray-500">
      It can be difficult to remember what chapters of the Bible you are supposed to read today to be able to read your
      Bible through in a year. We aim to make it easier for you to read God&apos;s Word in a year.
    </p>

    <Divider />

    <p className="text-sm text-gray-500 mt-10">The plan is quite simple:</p>

    <p className="font-bold text-gray-500 mt-5">Monday - Saturday</p>

    <ul className="list-disc list-inside">
      <li className="text-sm text-gray-500">
        Read <strong>2 Old Testament chapters</strong> and <strong>1 New Testament chapter</strong>
      </li>
    </ul>

    <p className="font-bold text-gray-500 mt-2">Sunday</p>

    <ul className="list-disc list-inside">
      <li className="text-sm text-gray-500">
        Read <strong>3 Old Testament chapters</strong> and <strong>2 New Testament chapters</strong>
      </li>
    </ul>

    <Divider />

    <p className="text-sm text-gray-500 mt-10">
      When you complete the New Testament near the end of the summer, add the amount of chapters you would read to your
      Old Testament reading.
    </p>

    <p className="font-bold text-gray-500 mt-5">Monday - Saturday</p>

    <ul className="list-disc list-inside">
      <li className="text-sm text-gray-500">
        Read <strong>3 Old Testament chapters</strong>
      </li>
    </ul>

    <p className="font-bold text-gray-500 mt-2">Sunday</p>

    <ul className="list-disc list-inside">
      <li className="text-sm text-gray-500">
        Read <strong>5 Old Testament chapters</strong>
      </li>
    </ul>

    <Divider />

    <p className="text-sm text-gray-500 mt-10">
      The goal of this program is to edify you as a believer in reading God&apos;s Love Letter to you each year. May the
      Lord bless you in your endeavors to glorify Him.
    </p>
  </>
)

const PsalmsPlanContent = () => (
  <>
    <p className="text-sm text-gray-500">
      The book of Psalms is a beautiful collection of songs, prayers, and poems that express the full range of human
      emotion before God. This plan helps you read through Psalms three times in a year.
    </p>

    <Divider />

    <p className="text-sm text-gray-500 mt-10">The plan is quite simple:</p>

    <p className="font-bold text-gray-500 mt-5">Monday - Friday</p>

    <ul className="list-disc list-inside">
      <li className="text-sm text-gray-500">
        Read <strong>1 Psalm</strong>
      </li>
    </ul>

    <p className="font-bold text-gray-500 mt-2">Saturday & Sunday</p>

    <ul className="list-disc list-inside">
      <li className="text-sm text-gray-500">
        Read <strong>2 Psalms</strong>
      </li>
    </ul>

    <Divider />

    <p className="text-sm text-gray-500 mt-10">
      <strong>Note:</strong> Psalm 119 is the longest chapter in the Bible with 176 verses. To make it more manageable,
      it is split into 4 readings of approximately 44 verses each.
    </p>

    <Divider />

    <p className="text-sm text-gray-500 mt-10">
      By following this plan, you will read through all 150 Psalms three times throughout the year, allowing these
      timeless words to become deeply familiar and meaningful in your walk with God.
    </p>
  </>
)

const ProverbsPlanContent = () => (
  <>
    <p className="text-sm text-gray-500">
      The book of Proverbs contains 31 chapters of wisdom for daily living. This plan helps you read through Proverbs
      every month, gaining fresh insights each time.
    </p>

    <Divider />

    <p className="text-sm text-gray-500 mt-10">The plan is quite simple:</p>

    <p className="font-bold text-gray-500 mt-5">Daily Reading</p>

    <ul className="list-disc list-inside">
      <li className="text-sm text-gray-500">
        Read <strong>1 chapter of Proverbs</strong> each day
      </li>
    </ul>

    <Divider />

    <p className="text-sm text-gray-500 mt-10">
      <strong>For shorter months:</strong>
    </p>

    <ul className="list-disc list-inside mt-2">
      <li className="text-sm text-gray-500">
        <strong>30-day months:</strong> Read 2 chapters on the last day
      </li>
      <li className="text-sm text-gray-500">
        <strong>February:</strong> The extra chapters are spread across the last few days
      </li>
    </ul>

    <Divider />

    <p className="text-sm text-gray-500 mt-10">
      By reading Proverbs monthly, you will go through this book of wisdom 12 times a year. Each reading brings new
      understanding as you apply these timeless principles to your daily life.
    </p>
  </>
)

const getTitle = (page: PageType): string => {
  switch (page) {
    case pages.psalms:
      return 'How do I read Psalms three times in a year?'
    case pages.proverbs:
      return 'How do I read Proverbs every month?'
    default:
      return 'How do I read my Bible through in a year?'
  }
}

const LearnModal = ({open, onChange, page = pages.home}: ILearnModal): React.ReactElement => {
  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto flex items-center justify-center h-12 w-12 mb-3">
            <Image src="/favicon_old/apple-touch-icon.png" alt="Read Your Bible Through" width={180} height={180} />
          </div>
          <DialogTitle className="text-center">{getTitle(page)}</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <div>
            {page === pages.psalms && <PsalmsPlanContent />}
            {page === pages.proverbs && <ProverbsPlanContent />}
            {page === pages.home && <BiblePlanContent />}
          </div>
        </div>

        <div className="mt-5">
          <ButtonLink
            className="w-full"
            onClick={() => {
              onChange(false)
              gtagEvent({
                action: 'learn_how_modal__get_started__button',
                category: 'engagement',
                label: 'click_event',
              })
            }}
          >
            Get Started
          </ButtonLink>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LearnModal
