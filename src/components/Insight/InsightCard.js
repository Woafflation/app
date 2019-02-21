import React from 'react'
import { Link } from 'react-router-dom'
import { Panel, Icon } from '@santiment-network/ui'
import moment from 'moment'
import cx from 'classnames'
import MultilineText from '../MultilineText/MultilineText'
import styles from './InsightCard.module.scss'

const InsightCard = ({
  id,
  user: author,
  title,
  tags,
  createdAt,
  votes: { totalVotes },
  comments,
  className
}) => {
  return (
    <Panel className={cx(styles.wrapper, className)}>
      <div className={styles.top}>
        <div className={styles.tags}>
          {tags.map(({ name }) => {
            return (
              <Link
                to={`/insights-sonar/tags/${name}`}
                key={name}
                className={styles.tag}
              >
                {name}
              </Link>
            )
          })}
        </div>
        <Link to={`/insights-sonar/${id}`} className={styles.title}>
          <MultilineText maxLines={2} id='insightCardTitle' text={title} />
        </Link>
      </div>
      <div className={styles.bottom}>
        <div className={styles.left}>
          <div className={styles.profile}>
            <div className={styles.profile__icon}>
              <Icon type='profile-round' />
            </div>
            <div className={styles.profile__info}>
              <Link
                to={`/insights-sonar/users/${author.id}`}
                className={styles.profile__name}
              >
                {author.username}
              </Link>
              <div className={styles.profile__status}>
                {moment(createdAt).fromNow()}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.stat}>
            <Icon type='like' /> {totalVotes}
          </div>
          <div className={styles.stat}>
            <Icon type='comment' /> {comments}
          </div>
        </div>
      </div>
    </Panel>
  )
}

InsightCard.defaultProps = {
  votes: {},
  tags: [],
  comments: 0
}

export default InsightCard
