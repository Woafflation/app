import React from 'react'
import SignalMasterModalForm from '../signalModal/SignalMasterModalForm'
import styles from './OpenSignalLink.module.scss'

const PERCENT_REGEXP = new RegExp(
  '( ?\\$?\\d+ {0,1}?.{0,1}?\\d+.?\\d{0,} ?\\%? {0,1}?)',
  'gi'
)

const prepareTitle = title => {
  const digits = title.match(PERCENT_REGEXP)

  if (digits && digits.length) {
    let result = []

    let temporaryTitle = title

    for (let i = 0; i < digits.length; i++) {
      const item = digits[i]

      if (item) {
        let partsForHighline = temporaryTitle.split(item)

        let first = partsForHighline[0]

        result.push(first)

        const isForceNegative =
          first.contains('down') || first.contains('below')

        if (item[0] === '-' || isForceNegative) {
          result.push(
            <span key={i} className={styles.down}>
              {item}
            </span>
          )
        } else {
          result.push(
            <span key={i} className={styles.up}>
              {item}
            </span>
          )
        }

        temporaryTitle = partsForHighline[1]

        if (i === digits.length - 1) {
          result.push(partsForHighline[1])
        }
      }
    }

    return result
  }

  return title
}

const OpenSignalLink = ({ signal: { id, title } }) => (
  <SignalMasterModalForm
    id={id}
    defaultOpen={false}
    canRedirect={false}
    trigger={<div className={styles.link}>{prepareTitle(title)}</div>}
  />
)

export default OpenSignalLink
