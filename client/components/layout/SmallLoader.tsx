import React from 'react'
import {classNames} from '../../helpers'

interface ISmallLoader {
  className?: string
  size?: 'small' | 'medium' | 'large'
  addSpacing?: boolean
  notCenter?: boolean
}

const SmallLoader = ({
  className,
  size = 'small',
  addSpacing,
  notCenter,
}: ISmallLoader): React.ReactElement => {
  return (
    <div
      className={classNames(
        !notCenter && 'flex flex-col items-center',
        addSpacing && 'py-10',
      )}
    >
      <svg
        className={classNames(
          'animate-spin text-primary',
          className,
          size === 'small'
            ? 'h-5 w-5'
            : size === 'medium'
            ? 'h-10 w-10'
            : 'h-20 w-20',
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

export default SmallLoader
