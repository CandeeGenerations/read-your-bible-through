import Link from 'next/link'
import React from 'react'

import {classNames} from '../../helpers'
import SmallLoader from '../layout/SmallLoader'

const ButtonLink = ({href = null, onClick = null, children, className = '', loading = false}) => {
  const classes =
    'inline-block mt-5 text-center items-center px-4 py-3 border-2 shadow-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'

  return href ? (
    <Link
      className={classNames(
        classes,
        className,
        loading
          ? 'border-muted hover:bg-muted bg-muted'
          : 'border-primary-300 text-primary-700 bg-transparent hover:bg-secondary-100',
      )}
      href={href}
      {...(onClick ? {onClick} : {})}
    >
      {loading ? <SmallLoader /> : children}
    </Link>
  ) : onClick ? (
    <button
      className={classNames(
        classes,
        className,
        loading
          ? 'border-muted hover:bg-muted bg-muted'
          : 'border-primary-300 text-primary-700 bg-transparent hover:bg-secondary-100',
      )}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? <SmallLoader /> : children}
    </button>
  ) : null
}

export default ButtonLink
