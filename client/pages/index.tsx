import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import Head from 'next/head'
import Image from 'next/image'
import React, {useContext, useEffect, useState} from 'react'
import {getBooks} from '../api/verse.api'
import ButtonLink from '../components/buttonLink'
import Layout from '../components/layout'
import Reading from '../components/layout/Reading'
import SEO from '../components/seo'
import {
  classNames,
  createCalendar,
  getBibleReading,
  setPageState,
} from '../helpers'
import {siteTitle} from '../helpers/constants'
import {ICalendarDay, IReadingPlan} from '../helpers/types'
import {gtagEvent} from '../libs/gtag'
import {LayoutContext} from './_app'

dayjs.extend(dayOfYear)

export interface IPageState {
  days?: ICalendarDay[]
  reading?: IReadingPlan[]
  selectedMonth?: dayjs.Dayjs
  selectedDay?: dayjs.Dayjs
}

const Home = (props) => {
  const {showHideLearnModal} = useContext(LayoutContext)
  const [pageState, stateFunc] = useState<IPageState>({
    days: [],
    reading: [],
    selectedMonth: dayjs(),
    selectedDay: dayjs(),
  })

  const setState = (state: IPageState) =>
    setPageState<IPageState>(stateFunc, pageState, state)

  useEffect(() => {
    setState({
      days: createCalendar(dayjs(), true),
      reading: getBibleReading(props.books),
    })
  }, [])

  const changeMonths = (forward: boolean, reset = false) => {
    const updatedMonth = reset
      ? dayjs()
      : pageState.selectedMonth[forward ? 'add' : 'subtract'](1, 'month')

    setState({
      selectedMonth: updatedMonth,
      days: createCalendar(updatedMonth, reset),
      selectedDay: reset ? updatedMonth : updatedMonth.startOf('month'),
    })
  }

  const selectDay = (day: string) =>
    setState({
      days: pageState.days.map((x) => ({
        ...x,
        isSelected: x.date === day,
      })),
      selectedDay: dayjs(day),
    })

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <SEO />

      <div className="mt-14 mb-16 mx-5">
        <Image
          src="/images/default.png"
          className="mx-auto"
          alt="Read Your Bible Through"
          width={672}
          height={53}
        />
      </div>

      <div className="text-center mb-16">
        <ButtonLink
          className="w-60"
          onClick={() => {
            showHideLearnModal(true)
            gtagEvent({
              action: 'home__learn_how__button',
              category: 'engagement',
              label: 'click_event',
            })
          }}
        >
          Learn How
        </ButtonLink>
      </div>

      <div className="md:grid md:grid-cols-4 md:divide-x md:divide-x-reverse md:divide-gray-200">
        <section className="mt-12 md:mt-0 md:pl-14 md:col-start-3 md:col-end-5 md:row-start-1">
          <h2 className="text-3xl text-gray-900 mb-14 font-linden text-center md:text-left">
            Bible Reading for <br />
            <time
              className="text-primary-600"
              dateTime={pageState.selectedDay.format('YYYY-MM-DD')}
            >
              {pageState.selectedDay.format('dddd, MMMM D, YYYY')}
            </time>
          </h2>

          <Reading {...pageState} />
        </section>

        <div className="pt-10 md:pt-0 md:pr-14 md:col-span-2">
          <div className="mt-10 text-center">
            <div className="flex items-center text-gray-900">
              <button
                type="button"
                onClick={() => changeMonths(false)}
                disabled={pageState.selectedMonth.month() === 0}
                className={classNames(
                  '-m-1.5 flex flex-none items-center justify-center p-1.5',
                  pageState.selectedMonth.month() === 0
                    ? 'hover:cursor-default text-gray-200'
                    : 'text-gray-400 hover:text-gray-500',
                )}
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="flex-auto text-2xl font-linden">
                {pageState.selectedMonth.format('MMMM')}
              </div>

              <button
                type="button"
                onClick={() => changeMonths(true)}
                disabled={pageState.selectedMonth.month() === 11}
                className={classNames(
                  '-m-1.5 flex flex-none items-center justify-center p-1.5',
                  pageState.selectedMonth.month() === 11
                    ? 'hover:cursor-default text-gray-200'
                    : 'text-gray-400 hover:text-gray-500',
                )}
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-7 text-sm leading-6 text-gray-500">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>

            <div className="isolate mt-2 text-sm grid grid-cols-7 gap-px rounded-lg bg-gray-200 shadow ring-1 ring-gray-200">
              {pageState.days.map((day, dayIdx) => (
                <button
                  key={dayIdx}
                  type="button"
                  disabled={!day.isCurrentMonth}
                  onClick={() => selectDay(day.date)}
                  className={classNames(
                    'py-1.5 focus:z-10',
                    day.isCurrentMonth
                      ? 'hover:bg-gray-100'
                      : 'hover:cursor-default',
                    day.isCurrentMonth
                      ? day.isToday
                        ? 'bg-secondary-100'
                        : 'bg-white'
                      : 'bg-gray-50',
                    (day.isSelected || day.isToday) && 'font-semibold',
                    day.isSelected && 'text-white',
                    !day.isSelected &&
                      day.isCurrentMonth &&
                      !day.isToday &&
                      'text-gray-900',
                    !day.isSelected &&
                      !day.isCurrentMonth &&
                      !day.isToday &&
                      'text-gray-400',
                    day.isToday && !day.isSelected && 'text-primary-600',
                    dayIdx === 0 && 'rounded-tl-lg',
                    dayIdx === 6 && 'rounded-tr-lg',
                    dayIdx === pageState.days.length - 7 && 'rounded-bl-lg',
                    dayIdx === pageState.days.length - 1 && 'rounded-br-lg',
                  )}
                >
                  <time
                    dateTime={day.date}
                    className={classNames(
                      'mx-auto flex h-10 w-10 lg:h-14 lg:w-14 items-center justify-center rounded-full',
                      day.isSelected && 'bg-primary-300',
                    )}
                  >
                    {day.date.split('-').pop().replace(/^0/, '')}
                  </time>
                </button>
              ))}
            </div>
          </div>

          <ButtonLink
            className="w-full"
            onClick={() => {
              changeMonths(false, true)
              gtagEvent({
                action: 'home__go_to_todays_reading__button',
                category: 'engagement',
                label: 'click_event',
              })
            }}
          >
            Go to Today&apos;s Reading
          </ButtonLink>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const books = await getBooks()

  return {
    props: {
      books,
    },
  }
}

export default Home
