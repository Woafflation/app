import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { DesktopOnly } from '../../Responsive'
import Panel from '@santiment-network/ui/Panel/Panel'
import SignalCardHeader from './SignalCardHeader'
import LikeBtnWrapper from '../../Like/LikeBtnWrapper'
import TrendingCardInsights from './trendingInsights/TrendingCardInsights'
import TrendingCardWords from './trendingCard/TrendingCardWords'
import FeedCardDate from '../../../pages/feed/GeneralFeed/CardDate/FeedCardDate'
import { getAmPmWithHours } from '../../../utils/dates'
import OpenSignalLink from '../../../ducks/Signals/link/OpenSignalLink'
import SignalCreator from './creator/SignalCreator'
import externalStyles from './SignalCard.module.scss'
import styles from './TrendingWordsSignalCard.module.scss'

export const isStrictTrendingWords = ({ operation, type }) =>
  type === 'trending_words' && operation && operation.trigger_time

export const isTrendingWordsSignal = trigger => {
  if (!trigger.settings) {
    return false
  }

  if (isStrictTrendingWords(trigger.settings)) {
    return true
  }

  return trigger.settings.operation && trigger.settings.operation.trending_word
}

const TrendingWordsSignalCard = ({
  className,
  activityPayload,
  activity: { votes, trigger, insertedAt: date, user },
  onLike
}) => {
  const {
    title,
    settings,
    isPublic,
    settings: { operation: { trigger_time } = {} }
  } = trigger

  const strictTrendingWords = isStrictTrendingWords(settings)

  return (
    <Panel padding className={cx(externalStyles.wrapper, className)}>
      <DesktopOnly>
        <SignalCardHeader
          isUserTheAuthor={false}
          isPublic={isPublic}
          signal={trigger}
        />
      </DesktopOnly>

      <div className={externalStyles.wrapper__right}>
        <div className={styles.header}>
          {strictTrendingWords ? (
            <Link to='/labs/trends' className={externalStyles.title}>
              {title} {<TrendingPeriod period={trigger_time} />}
            </Link>
          ) : (
            <OpenSignalLink signal={trigger} />
          )}
          <FeedCardDate date={date} />
        </div>

        <TrendingCardWords
          settings={settings}
          activityPayload={activityPayload}
        />

        {strictTrendingWords && <TrendingCardInsights date={new Date(date)} />}

        <SignalCreator user={user} />

        <div className={styles.bottom}>
          <LikeBtnWrapper
            onLike={onLike}
            className={styles.likeBtn}
            votes={votes}
            user={user}
          />
        </div>
      </div>
    </Panel>
  )
}

const TrendingPeriod = ({ period }) => {
  if (!period) {
    return null
  }

  const hours = period.split(':')[0]

  return (
    <div className={styles.ampm}>
      ({getAmPmWithHours(hours - 8)} - {getAmPmWithHours(hours)})
    </div>
  )
}

export default TrendingWordsSignalCard
