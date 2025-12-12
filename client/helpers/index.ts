import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import {parseCookies, setCookie as sCookie} from 'nookies'

import {NT_BOOKS} from './constants'
import {IBibleBook, ICalendarDay, IReadingPlan, ITestamentReading} from './types'

dayjs.extend(advancedFormat)

export const classNames = (...classes: string[]): string => classes.filter(Boolean).join(' ')

export function setPageState<T>(
  // eslint-disable-next-line no-unused-vars
  setState: (updates: T) => void,
  current: T,
  updates: T,
): T {
  const newState = {...current, ...updates}

  setState(newState)

  return newState
}

export const createCalendarItem = (
  date: dayjs.Dayjs,
  todaySelected = false,
  isCurrentMonth = true,
  selectedDate: dayjs.Dayjs | undefined = undefined,
): ICalendarDay => {
  const now = dayjs()
  const isToday = date.isSame(now, 'day')

  return {
    date: date.format('YYYY-MM-DD'),
    isCurrentMonth,
    isToday,
    isSelected:
      (todaySelected && isToday) ||
      (!todaySelected && !isToday && !selectedDate && isCurrentMonth && date.date() === 1) ||
      (selectedDate && date.isSame(selectedDate, 'day')),
  }
}

export const createCalendar = (
  month: dayjs.Dayjs,
  todaySelected = false,
  selectedDate: dayjs.Dayjs | undefined = undefined,
): ICalendarDay[] => {
  const daysInMonth = month.daysInMonth()
  const startOfMonth = month.startOf('month').format('ddd')
  const endOfMonth = month.endOf('month').format('ddd')
  const weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const calendar = []
  const daysBefore = weekdaysShort.indexOf(startOfMonth)
  const daysAfter = weekdaysShort.length - 1 - weekdaysShort.indexOf(endOfMonth)
  let clone = month.startOf('month')

  if (daysBefore > 0) {
    clone = clone.subtract(daysBefore, 'day')
  }

  for (let i = 0; i < daysBefore; i++) {
    calendar.push(createCalendarItem(clone, todaySelected, false, selectedDate))
    clone = clone.add(1, 'day')
  }

  for (let i = 0; i < daysInMonth; i++) {
    calendar.push(createCalendarItem(clone, todaySelected, true, selectedDate))
    clone = clone.add(1, 'day')
  }

  for (let i = 0; i < daysAfter; i++) {
    calendar.push(createCalendarItem(clone, todaySelected, false, selectedDate))
    clone = clone.add(1, 'day')
  }

  return calendar
}

export const getBibleReading = (books: IBibleBook[]): IReadingPlan[] => {
  let index = 0
  let otIndex = 0
  let ntIndex = 0
  const otChapters: ITestamentReading[] = []
  const ntChapters: ITestamentReading[] = []

  for (const book of books) {
    for (const chapter of book.chapters.filter((x) => x.number !== 'intro')) {
      const entry = {
        index,
        book: book.id,
        name: book.name,
        chapter: chapter.number,
      }

      if (NT_BOOKS.includes(book.id)) {
        ntChapters.push(entry)
      } else {
        otChapters.push(entry)
      }

      index = index + 1
    }
  }

  const bibleReading: IReadingPlan[] = []
  const now = dayjs()

  for (let i = 0; i <= 364; i++) {
    const date = dayjs()
      .dayOfYear(i + 1)
      .startOf('day')
    const isSunday = date.day() === 0
    let otIncrease = isSunday ? 3 : 2
    const ntIncrease = isSunday ? 2 : 1
    const ntReading = ntChapters.slice(ntIndex, ntIndex + ntIncrease)

    if (ntReading.length === 0 || (ntReading.length === 1 && isSunday)) {
      otIncrease = isSunday ? 3 + (2 - ntReading.length) : 3
    }

    bibleReading.push({
      date: date,
      index: i,
      today: date.isSame(now.startOf('day'), 'day'),
      otReading: otChapters.slice(otIndex, otIndex + otIncrease),
      ntReading: ntReading,
    })

    otIndex = otIndex + otIncrease
    ntIndex = ntIndex + ntIncrease
  }

  return bibleReading
}

export const getProverbsReading = (month: dayjs.Dayjs): IReadingPlan[] => {
  const now = dayjs()
  const targetMonth = month.year(now.year()).startOf('month')
  const daysInMonth = targetMonth.daysInMonth()
  const totalChapters = 31

  // Calculate how to distribute 31 chapters across the month
  // 31 days: 1 chapter per day
  // 30 days: 2 chapters on the last day
  // 28 days (Feb): spread extra 3 chapters over last 3 days (2 chapters each)
  // 29 days (Feb leap): spread extra 2 chapters over last 2 days (2 chapters each)
  const extraChapters = totalChapters - daysInMonth
  const proverbsReading: IReadingPlan[] = []

  let chapterIndex = 0

  for (let i = 0; i < daysInMonth; i++) {
    const date = targetMonth.add(i, 'day')
    const dayNumber = i + 1
    const daysRemaining = daysInMonth - dayNumber

    // Determine how many chapters to read today
    let chaptersToRead = 1

    if (extraChapters > 0 && daysRemaining < extraChapters) {
      // We need to double up on the last `extraChapters` days
      chaptersToRead = 2
    }

    const reading: ITestamentReading[] = []

    for (let j = 0; j < chaptersToRead && chapterIndex < totalChapters; j++) {
      reading.push({
        index: chapterIndex,
        book: 'PRO',
        name: 'Proverbs',
        chapter: String(chapterIndex + 1),
      })
      chapterIndex++
    }

    proverbsReading.push({
      date,
      index: i,
      today: date.isSame(now.startOf('day'), 'day'),
      otReading: reading,
      ntReading: [],
    })
  }

  return proverbsReading
}

export const getPsalmsReading = (): IReadingPlan[] => {
  const now = dayjs()
  const totalPsalms = 150
  const timesThrough = 3

  // Build the reading list: Psalms 1-150, three times
  // Psalm 119 is split into 4 parts (it has 22 sections of 8 verses, ~176 verses total)
  // We'll split it into parts: 1-44, 45-88, 89-132, 133-176 (by verse ranges)
  const psalmsChapters: {chapter: string; name: string}[] = []

  for (let round = 0; round < timesThrough; round++) {
    for (let i = 1; i <= totalPsalms; i++) {
      if (i === 119) {
        // Split Psalm 119 into 4 parts
        psalmsChapters.push({chapter: '119:1-44', name: 'Psalm'})
        psalmsChapters.push({chapter: '119:45-88', name: 'Psalm'})
        psalmsChapters.push({chapter: '119:89-132', name: 'Psalm'})
        psalmsChapters.push({chapter: '119:133-176', name: 'Psalm'})
      } else {
        psalmsChapters.push({chapter: String(i), name: `Psalm`})
      }
    }
  }

  const psalmsReading: IReadingPlan[] = []
  let chapterIndex = 0

  for (let i = 0; i < 365; i++) {
    const date = dayjs()
      .dayOfYear(i + 1)
      .startOf('day')
    const dayOfWeek = date.day()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // 1 chapter on weekdays, 2 on weekends
    const chaptersToRead = isWeekend ? 2 : 1

    const reading: ITestamentReading[] = []

    for (let j = 0; j < chaptersToRead && chapterIndex < psalmsChapters.length; j++) {
      const psalm = psalmsChapters[chapterIndex]
      reading.push({
        index: chapterIndex,
        book: 'PSA',
        name: psalm.name,
        chapter: psalm.chapter,
      })
      chapterIndex++
    }

    psalmsReading.push({
      date,
      index: i,
      today: date.isSame(now.startOf('day'), 'day'),
      otReading: reading,
      ntReading: [],
    })
  }

  return psalmsReading
}

/** --- COPIED --- **/

export const getCookie = (name) => {
  const cookies = parseCookies()

  if (cookies && cookies[name]) {
    return cookies[name]
  }

  return null
}

export const setCookie = (name, value) => {
  sCookie(null, name, value, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  })
}

export const getDate = (date) => {
  const dayjsDate = dayjs(date)

  return dayjsDate.format('MMMM Do, YYYY')
}

export const clamp = (value: number, min: number, max: number) => (value < min ? min : value > max ? max : value)

export const getWindowDimensions = (): {height: number; width: number} => {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth

    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

    return {
      height,
      width,
    }
  }

  return {
    width: 0,
    height: 0,
  }
}

export function copyToClipboard(toCopy: string) {
  const el = document.createElement(`textarea`)
  el.value = toCopy
  el.setAttribute(`readonly`, ``)
  el.style.position = `absolute`
  el.style.left = `-9999px`
  document.body.appendChild(el)
  el.select()
  document.execCommand(`copy`)
  document.body.removeChild(el)
}
