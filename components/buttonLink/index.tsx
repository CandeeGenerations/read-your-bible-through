import React from 'react'
import {classNames} from '../../helpers'

const ButtonLink = ({
  href = null,
  onClick = null,
  children,
  anchor = false,
  className = '',
}) => {
  const classes =
    'mt-5 text-center items-center px-4 py-3 border-2 border-primary-300 shadow-sm font-medium rounded-md text-primary-700 bg-transparent hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
  const anchorProps = anchor
    ? {rel: 'noopener noreferrer', target: '_blank'}
    : {}

  return href ? (
    <a
      className={classNames(classes, className)}
      href={href}
      {...anchorProps}
      {...(onClick ? {onClick} : {})}
    >
      {children}
    </a>
  ) : onClick ? (
    <button className={classNames(classes, className)} onClick={onClick}>
      {children}
    </button>
  ) : null
}

export default ButtonLink
