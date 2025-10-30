'use client'

import {faSquareCheck} from '@fortawesome/free-regular-svg-icons'
import {faCheckSquare} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline'
import axios from 'axios'
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import minMax from 'dayjs/plugin/minMax'
import React, {useEffect, useState} from 'react'

import {classNames, createCalendar, getBibleReading, setPageState} from '../helpers'
import {ICalendarDay, IPassageTrack, IReadingPlan} from '../helpers/types'
import {gtagEvent} from '../libs/gtag'
import {useUser} from '../providers/user.provider'
import ButtonLink from './buttonLink'
import Reading from './layout/Reading'

dayjs.extend(minMax)
dayjs.extend(dayOfYear)

export interface IPageState {
  days?: ICalendarDay[]
  reading?: IReadingPlan[]
  selectedMonth?: dayjs.Dayjs
  selectedDay?: dayjs.Dayjs
  tracks?: IPassageTrack[]
  passageTrack?: IPassageTrack
  countDays?: number
  goalAchieved?: boolean
  progress?: number
  nextReading?: dayjs.Dayjs
  markingRead?: boolean
}

const Calendar = (): React.ReactElement => {
  const {userInfo, loadTracks, tracks} = useUser()
  const [pageState, stateFunc] = useState<IPageState>({
    days: [],
    reading: [],
    tracks: [],
    selectedMonth: dayjs(),
    selectedDay: dayjs(),
    countDays: 365,
    goalAchieved: false,
    progress: 0,
    markingRead: false,
  })
  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const getNextReadingDate = (tracks: IPassageTrack[]): dayjs.Dayjs | undefined => {
    for (const key in tracks.sort((a, b) => dayjs(a.passageDate).diff(dayjs(b.passageDate), 'day'))) {
      const track = tracks[Number(key)]
      const nextTrack: IPassageTrack = tracks[Number(key) + 1]

      if (!nextTrack) {
        return dayjs(track.passageDate).add(1, 'day')
      }

      if (dayjs(nextTrack.passageDate).diff(dayjs(track.passageDate), 'day') > 1) {
        return dayjs(track.passageDate).add(1, 'day')
      }
    }

    return undefined
  }

  const getTracks = async () => {
    const {data: books} = await axios.get('/books')
    const reading = getBibleReading(books)
    const state: IPageState = {
      days: createCalendar(dayjs(), true),
      reading,
      tracks: [],
      countDays: reading.filter((x) => x.otReading.length > 0).length,
    }

    if (userInfo) {
      state.tracks = tracks
      state.passageTrack = tracks.find((x) => dayjs(x.passageDate).isSame(pageState.selectedDay, 'day'))
      state.goalAchieved = goalAchieved(pageState.countDays, tracks.length)
      state.progress = calculateProgress(pageState.countDays, tracks.length)
      state.nextReading = getNextReadingDate(tracks)
    }

    setState({...state})
  }

  useEffect(() => {
    getTracks()
  }, [])

  const changeMonths = (forward: boolean, reset = false) => {
    const updatedMonth = reset ? dayjs() : pageState.selectedMonth[forward ? 'add' : 'subtract'](1, 'month')
    const selectedDay = reset ? updatedMonth : updatedMonth.startOf('month')

    setState({
      selectedMonth: updatedMonth,
      days: createCalendar(updatedMonth, reset),
      selectedDay,
      passageTrack: (pageState.tracks || []).find((x) => dayjs(x.passageDate).isSame(selectedDay, 'day')),
      goalAchieved: goalAchieved(pageState.countDays, pageState.tracks.length),
      progress: calculateProgress(pageState.countDays, pageState.tracks.length),
    })
  }

  const selectDay = (day: string) => {
    const selectedDay = dayjs(day)

    setState({
      days: pageState.days.map((x) => ({
        ...x,
        isSelected: x.date === day,
      })),
      selectedDay,
      passageTrack: (pageState.tracks || []).find((x) => dayjs(x.passageDate).isSame(selectedDay, 'day')),
      goalAchieved: goalAchieved(pageState.countDays, pageState.tracks.length),
      progress: calculateProgress(pageState.countDays, pageState.tracks.length),
    })
  }

  const markAsReadUnread = async () => {
    setState({markingRead: true})

    await axios.post(`/user/${userInfo.id}/track${pageState.passageTrack ? `/${pageState.passageTrack.id}` : ''}`, {
      passageDate: pageState.selectedDay.format('YYYY-MM-DD'),
    })
    const updatedTracks = await loadTracks()

    setState({
      tracks: updatedTracks,
      passageTrack: (updatedTracks || []).find((x) => dayjs(x.passageDate).isSame(pageState.selectedDay, 'day')),
      goalAchieved: goalAchieved(pageState.countDays, updatedTracks.length),
      progress: calculateProgress(pageState.countDays, updatedTracks.length),
      nextReading: getNextReadingDate(updatedTracks),
      markingRead: false,
    })
  }

  const goToNextReading = () => {
    if (pageState.nextReading) {
      setState({
        days: createCalendar(pageState.nextReading, false, pageState.nextReading),
        selectedMonth: pageState.nextReading,
        selectedDay: pageState.nextReading,
        passageTrack: (pageState.tracks || []).find((x) => dayjs(x.passageDate).isSame(pageState.nextReading, 'day')),
        goalAchieved: goalAchieved(pageState.countDays, pageState.tracks.length),
        progress: calculateProgress(pageState.countDays, pageState.tracks.length),
      })
    }
  }

  const calculateProgress = (goal: number, total: number): number => Math.ceil((total / goal) * 100)

  const goalAchieved = (goal: number, total: number): boolean => total >= goal

  return (
    <div className="md:grid md:grid-cols-4 md:divide-x md:divide-x-reverse md:divide-gray-200">
      <section className="mt-12 md:mt-0 md:pl-14 md:col-start-3 md:col-end-5 md:row-start-1">
        <h2 className="text-3xl text-gray-900 mb-14 font-linden text-center md:text-left">
          Bible Reading for <br />
          <time className="text-primary-600" dateTime={pageState.selectedDay.format('YYYY-MM-DD')}>
            {pageState.selectedDay.format('dddd, MMMM D, YYYY')}
          </time>
        </h2>

        <Reading {...pageState} />

        {userInfo && (
          <>
            {(pageState.reading.find((x) => x.date.isSame(pageState.selectedDay, 'day'))?.otReading || []).length >
              0 && (
              <ButtonLink
                onClick={markAsReadUnread}
                loading={pageState.markingRead}
                className={classNames(
                  'flex flex-row items-center w-full justify-center lg:justify-start lg:w-auto',
                  !pageState.markingRead &&
                    (pageState.passageTrack
                      ? '!text-rose-700 !border-rose-300 !bg-rose-50 hover:!bg-rose-100 focus:!ring-rose-500'
                      : '!text-emerald-700 !border-emerald-300 !bg-emerald-50 hover:!bg-emerald-100 focus:!ring-emerald-500'),
                )}
              >
                <FontAwesomeIcon
                  icon={pageState.passageTrack ? faSquareCheck : faCheckSquare}
                  className="w-4 h-4 mr-2"
                />{' '}
                Mark as {pageState.passageTrack ? 'Unread' : 'Read'}
              </ButtonLink>
            )}

            <h2 className="text-3xl text-gray-900 mb-6 mt-12 font-linden text-center md:text-left">Your Progress</h2>

            {pageState.progress < 10 ? (
              <div>
                <em>Mark more passages as read to see your progress.</em>

                <div className="w-full h-6 bg-gray-200 rounded-full mt-4" />
              </div>
            ) : (
              <div className="w-full h-6 bg-gray-200 rounded-full">
                <div
                  className="font-medium text-center p-0.5 pt-1 text-white leading-none h-6 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full"
                  style={{
                    width: pageState.goalAchieved ? '100%' : `${pageState.progress}%`,
                  }}
                >
                  {pageState.goalAchieved ? 'Goal Achieved!' : pageState.progress >= 10 ? `${pageState.progress}%` : ''}
                </div>
              </div>
            )}
          </>
        )}
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

            <div className="flex-auto text-2xl font-linden">{pageState.selectedMonth.format('MMMM')}</div>

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
            {pageState.days.map((day, dayIdx) => {
              const tracked = (pageState.tracks || []).find((x) => dayjs(x.passageDate).isSame(dayjs(day.date), 'day'))

              return (
                <button
                  key={dayIdx}
                  type="button"
                  disabled={!day.isCurrentMonth}
                  onClick={() => selectDay(day.date)}
                  className={classNames(
                    'py-1.5 focus:z-10',
                    day.isCurrentMonth ? 'hover:bg-gray-100' : 'hover:cursor-default',
                    day.isCurrentMonth
                      ? tracked
                        ? 'bg-emerald-100'
                        : day.isToday
                          ? 'bg-secondary-100'
                          : 'bg-white'
                      : 'bg-gray-50',
                    (day.isSelected || day.isToday) && 'font-semibold',
                    day.isSelected && 'text-white',
                    !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900',
                    !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-400',
                    day.isToday && !day.isSelected && 'text-primary-600',
                    dayIdx === 0 && 'rounded-tl-lg',
                    dayIdx === 6 && 'rounded-tr-lg',
                    dayIdx === pageState.days.length - 7 && 'rounded-bl-lg',
                    dayIdx === pageState.days.length - 1 && 'rounded-br-lg',
                    tracked && day.isCurrentMonth && 'bg-emerald-100 text-white hover:bg-gray-50',
                  )}
                >
                  <time
                    dateTime={day.date}
                    className={classNames(
                      'mx-auto flex h-10 w-10 lg:h-14 lg:w-14 items-center justify-center rounded-full',
                      day.isSelected && !tracked && 'bg-primary-300 border-2 border-primary-500',
                      day.isSelected && tracked && 'border-2',
                      tracked && day.isCurrentMonth && 'bg-emerald-300 border-emerald-500',
                    )}
                  >
                    {day.date.split('-').pop().replace(/^0/, '')}
                  </time>
                </button>
              )
            })}
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

        {userInfo &&
          pageState.nextReading &&
          pageState.reading.filter((x) => x.otReading.length > 0).length > pageState.tracks.length && (
            <a
              className="underline cursor-pointer block py-2 text-center mt-5"
              onClick={() => {
                goToNextReading()
                gtagEvent({
                  action: 'home__go_to_next_reading__button',
                  category: 'engagement',
                  label: 'click_event',
                })
              }}
            >
              Go to Next Reading
            </a>
          )}
      </div>
    </div>
  )
}

export default Calendar
