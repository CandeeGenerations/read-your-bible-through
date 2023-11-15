export interface ILog {
  level: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  message: string
  space?: boolean
}

export interface ILogs {
  logs: ILog[]
}

export interface ILogsAndErrors extends ILogs {
  errors: IError[]
}

export interface IError {
  code?: string
  title: string
  data?: string | object
  message?: string
}

export interface IException {
  name: string
  message: string
}
