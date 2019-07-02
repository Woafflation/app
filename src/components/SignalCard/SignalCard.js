import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import Panel from '@santiment-network/ui/Panel/Panel'
import Icon from '@santiment-network/ui/Icon'
import Toggle from '@santiment-network/ui/Toggle'
import MultilineText from '../../components/MultilineText/MultilineText'
import StatusLabel from './../../components/StatusLabel'
import { RemoveSignalButton, SignalTypeIcon } from './controls/SignalControls'
import styles from './SignalCard.module.scss'

const SignalCard = ({
  id,
  title,
  description = '',
  settings: { type } = {},
  className = '',
  removeSignal,
  goToSignalSettings,
  author = 'Myself',
  ...signalCardBottom
}) => {
  const isAwaiting = +id <= 0

  return (
    <Panel padding className={cx(styles.wrapper, className)}>
      <div
        className={cx(styles.wrapper__left, styles.wrapper__left_subscription)}
      >
        <SignalTypeIcon type={type} />
      </div>
      <div className={styles.wrapper__right}>
        <div onClick={goToSignalSettings}>
          <div className={styles.upper}>
            <h2 className={styles.title}>{title}</h2>
            {description && (
              <h3 className={styles.description}>
                <MultilineText
                  id='SignalCard__description'
                  maxLines={2}
                  text={description}
                />
              </h3>
            )}
          </div>
        </div>
        {author && (
          <SignalCardBottom
            signalId={id}
            removeSignal={removeSignal}
            isAwaiting={isAwaiting}
            author={author}
            {...signalCardBottom}
          />
        )}
      </div>
    </Panel>
  )
}

const UnpublishedMsg = () => (
  <h4 className={styles.awaiting}>
    <Icon type='clock' className={styles.awaiting__icon} /> Awaiting posting
  </h4>
)

const SignalCardBottom = ({
  signalId,
  removeSignal,
  author,
  isPublic,
  isPublished = true,
  isActive,
  isAwaiting = false,
  toggleSignal
}) => {
  const isUserTheAuthor = true
  const [isOpen, setOpen] = useState(false)

  return (
    <div className={styles.bottom}>
      <div className={styles.more}>
        <div
          onClick={() => setOpen(!isOpen)}
          className={cx(styles.expandButton, styles.popupButton)}
        >
          <Icon type='dots' className={styles.moreIcon} />
          <span>More</span>
        </div>
        {isOpen && (
          <div className={styles.popup} onMouseLeave={() => setOpen(false)}>
            <div className={cx(styles.popupItem, styles.popupButton)}>
              <Link
                to={`/sonar/feed/details/${signalId}/edit`}
                className={styles.link}
              >
                Edit signal
              </Link>
            </div>

            <div className={cx(styles.popupItem, styles.popupButton)}>
              <Link
                to={`/sonar/feed/details/${signalId}/about`}
                className={styles.link}
              >
                Edit signal & description
              </Link>
            </div>

            <div className={cx(styles.popupItem, styles.popupButton)}>
              <RemoveSignalButton
                id={signalId}
                removeSignal={removeSignal}
                trigger={<div>Delete</div>}
              />
            </div>
          </div>
        )}
        <div className={styles.verticalDivider} />
      </div>

      {isPublished ? (
        <h4 className={styles.author}>
          {isAwaiting && (
            <div className={styles.awaitingBlock}>
              <Icon type='awaiting' />
              <span>&nbsp;&nbsp;Awaiting confirmation</span>
            </div>
          )}
          {isUserTheAuthor && !isAwaiting && (
            <StatusLabel isPublic={isPublic} />
          )}
          {!isUserTheAuthor && (
            <Fragment>
              by{' '}
              <Link className={styles.author__link} to='/'>
                {author}
              </Link>
            </Fragment>
          )}
        </h4>
      ) : (
        <UnpublishedMsg />
      )}
      <div className={styles.right}>
        <Toggle onClick={toggleSignal} isActive={isActive} />
      </div>
    </div>
  )
}

export default SignalCard
