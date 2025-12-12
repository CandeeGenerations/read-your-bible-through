import {pages} from '@/helpers/constants'
import {usePage} from '@/providers/page.provider'
import {ArrowTopRightOnSquareIcon, CheckCircleIcon} from '@heroicons/react/24/outline'
import React from 'react'

import {IDisplayReading, ITestamentReading} from '../../helpers/types'
import {IPageState} from '../Calendar'

const Alert = ({title, children}: {title: string; children: React.ReactNode}): React.ReactElement => {
  return (
    <div className="rounded-md border-emerald-600 border-2 bg-emerald-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-7 w-7 text-emerald-600" aria-hidden="true" />
        </div>

        <div className="ml-3">
          <h3 className="text-2xl font-linden font-medium text-emerald-800">{title}</h3>

          <div className="mt-2 text-emerald-700">
            <p>{children}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Testament = ({
  testamentReading,
  newTestament = false,
}: {
  testamentReading: ITestamentReading[]
  newTestament?: boolean
}): React.ReactElement => {
  let reading: IDisplayReading[] = []

  for (const item of testamentReading) {
    if (reading.find((x) => x.book === item.name)) {
      reading = reading.map((x) => ({
        ...x,
        chapters: x.book === item.name ? [...x.chapters, item.chapter] : x.chapters,
      }))
    } else {
      reading.push({book: item.name, chapters: [item.chapter]})
    }
  }

  const link =
    reading &&
    `https://www.biblegateway.com/passage/?version=KJV&search=${encodeURIComponent(
      reading.map((x) => `${x.book} ${x.chapters.join(',')}`).join(','),
    )}`

  const item = (
    <div className="relative rounded-lg border-2 border-gray-300 bg-white px-6 py-5 shadow-sm space-x-3 cursor-pointer hover:border-primary-300 group">
      <div className="flex flex-row items-center">
        <div className="grow">
          <p className="text-2xl text-gray-900">
            {reading.map(
              (x, index) =>
                `${x.book} ${x.chapters.join(', ').replace(/, ([^,]*)$/, ' and $1')}${
                  reading.length > 1 && index !== reading.length - 1 ? ', ' : ''
                }`,
            )}
          </p>

          <p className="text-primary-700 truncate">{newTestament ? 'New' : 'Old'} Testament</p>
        </div>

        {link && (
          <div className="flex-none w-10">
            <ArrowTopRightOnSquareIcon className="w-8 h-8 text-gray-400 group-hover:text-primary-500" />
          </div>
        )}
      </div>
    </div>
  )

  return reading.length > 0 ? (
    link ? (
      <a href={link} target="_blank" rel="noreferrer noopener">
        {item}
      </a>
    ) : (
      item
    )
  ) : newTestament ? (
    <Alert title="New Testament Complete">
      Since you have finished reading the New Testament, additional chapters have been added to the Old Testament
      reading.
    </Alert>
  ) : null
}

const Reading = (pageState: IPageState): React.ReactElement => {
  const {current: page, getTitle} = usePage()
  const title = getTitle()
  const reading = pageState.reading.find((x) => x.date.isSame(pageState.selectedDay, 'day'))

  if (!reading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">No reading for today</p>
          </div>
        </div>
      </div>
    )
  }

  if (reading.otReading.length === 0) {
    return (
      <Alert title="Bible Reading Plan Completed">
        <strong>Congratulations!</strong> You have completed the {title} reading plan for this year! Check back on
        January 1st to start the next {title} reading plan.
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <Testament testamentReading={reading.otReading} />

      {page === pages.home && <Testament testamentReading={reading.ntReading} newTestament />}
    </div>
  )
}

export default Reading
