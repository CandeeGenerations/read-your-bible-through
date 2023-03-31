import dayjs from 'dayjs'
import {parseCookies, setCookie as sCookie} from 'nookies'
import {NT_BOOKS} from './constants'
import {
  IBibleBook,
  ICalendarDay,
  IReadingPlan,
  ITestamentReading,
} from './types'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const advancedFormat = require('dayjs/plugin/advancedFormat')

dayjs.extend(advancedFormat)

export const classNames = (...classes: string[]): string =>
  classes.filter(Boolean).join(' ')

// eslint-disable-next-line no-unused-vars
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
): ICalendarDay => {
  const now = dayjs()
  const isToday = date.isSame(now, 'day')

  return {
    date: date.format('YYYY-MM-DD'),
    isCurrentMonth,
    isToday,
    isSelected:
      (todaySelected && isToday) ||
      (!todaySelected && !isToday && isCurrentMonth && date.date() === 1),
  }
}

export const createCalendar = (
  month: dayjs.Dayjs,
  todaySelected = false,
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
    calendar.push(createCalendarItem(clone, todaySelected, false))
    clone = clone.add(1, 'day')
  }

  for (let i = 0; i < daysInMonth; i++) {
    calendar.push(createCalendarItem(clone, todaySelected))
    clone = clone.add(1, 'day')
  }

  for (let i = 0; i < daysAfter; i++) {
    calendar.push(createCalendarItem(clone, todaySelected, false))
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

export const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value

export const getWindowDimensions = (): {height: number; width: number} => {
  if (typeof window !== 'undefined') {
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth

    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight

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
