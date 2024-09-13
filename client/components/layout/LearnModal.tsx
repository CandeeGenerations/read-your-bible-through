import {Dialog, Transition} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import Image from 'next/image'
import React, {Fragment} from 'react'

import {gtagEvent} from '../../libs/gtag'
import ButtonLink from '../buttonLink'

interface ILearnModal {
  // eslint-disable-next-line no-unused-vars
  onChange: (open: boolean) => void
  open: boolean
}

const LearnModal = ({open, onChange}: ILearnModal): React.ReactElement => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={(open) => onChange(open)}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => {
                    onChange(false)
                    gtagEvent({
                      action: 'learn_how_modal__close__link',
                      category: 'engagement',
                      label: 'click_event',
                    })
                  }}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12">
                  <Image
                    src="/favicon_old/apple-touch-icon.png"
                    alt="Read Your Bible Through"
                    width={180}
                    height={180}
                  />
                </div>

                <div className="mt-3 sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg text-center leading-6 font-medium text-gray-900">
                    How do I read my Bible through in a year?
                  </Dialog.Title>

                  <div className="mt-5">
                    <p className="text-sm text-gray-500">
                      It can be difficult to remember what chapters of the Bible you are supposed to read today to be
                      able to read your Bible through in a year. We aim to make it easier for you to read God&apos;s
                      Word in a year.
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
                      When you complete the New Testament near the end of the summer, add the amount of chapters you
                      would read to your Old Testament reading.
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
                      The goal of this program is to edify you as a believer in reading God&apos;s Love Letter to you
                      each year. May the Lord bless you in your endeavors to glorify Him.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
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
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default LearnModal
