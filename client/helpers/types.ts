import dayjs from 'dayjs'

export interface ICalendarDay {
  date: string
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
}

export interface IBibleChapter {
  id: string
  bibleId: string
  number: string
  bookId: string
  reference: string
}

export interface IBibleBook {
  id: string
  bibleId: string
  abbreviation: string
  name: string
  nameLong: string
  chapters: IBibleChapter[]
}

export interface ITestamentReading {
  index: number
  book: string
  name: string
  chapter: string
}

export interface IReadingPlan {
  date: dayjs.Dayjs
  index: number
  today: boolean
  otReading: ITestamentReading[]
  ntReading: ITestamentReading[]
}

export interface IDisplayReading {
  book: string
  chapters: string[]
}

export interface IPassageTrack {
  id: string
  passageDate: string
}
