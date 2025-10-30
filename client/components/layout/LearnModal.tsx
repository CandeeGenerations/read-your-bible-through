'use client'

import Image from 'next/image'
import React from 'react'

import {gtagEvent} from '../../libs/gtag'
import ButtonLink from '../buttonLink'
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '../ui/dialog'

interface ILearnModal {
  // eslint-disable-next-line no-unused-vars
  onChange: (open: boolean) => void
  open: boolean
}

const LearnModal = ({open, onChange}: ILearnModal): React.ReactElement => {
  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto flex items-center justify-center h-12 w-12 mb-3">
            <Image src="/favicon_old/apple-touch-icon.png" alt="Read Your Bible Through" width={180} height={180} />
          </div>
          <DialogTitle className="text-center">How do I read my Bible through in a year?</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <div>
            <p className="text-sm text-gray-500">
              It can be difficult to remember what chapters of the Bible you are supposed to read today to be able to
              read your Bible through in a year. We aim to make it easier for you to read God&apos;s Word in a year.
            </p>

            <div className="relative mt-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
            </div>

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

            <div className="relative mt-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-10">
              When you complete the New Testament near the end of the summer, add the amount of chapters you would read
              to your Old Testament reading.
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

            <div className="relative mt-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-10">
              The goal of this program is to edify you as a believer in reading God&apos;s Love Letter to you each year.
              May the Lord bless you in your endeavors to glorify Him.
            </p>
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
