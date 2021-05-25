import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { useQuery } from '@apollo/react-hooks'
import isEqual from 'lodash.isequal'
import Icon from '@santiment-network/ui/Icon'
import { ACTIVE_WIDGETS_QUERY } from './gql'
import { DarkVideoPlayBtn } from '../VideoPlayBtn/VideoPlayBtn'
import styles from './index.module.scss'
import MeetupWidget from './MeetupWidget'

const FINISH_MEETUP_DATE = new Date('May 27, 2021 16:00:00')

const extractYoutubeId = link => {
  if (!link) {
    return null
  }

  const items = link.split('=')
  return items[items.length - 1]
}

const HIDDEN_WIDGET_KEY = 'HIDDEN_WIDGET_KEY'

function canShowWidget (activeWidget) {
  if (!activeWidget) {
    return false
  }

  const lastWidget = localStorage.getItem(HIDDEN_WIDGET_KEY)
  return !lastWidget || !isEqual(activeWidget, JSON.parse(lastWidget))
}

export const useActiveWebinars = () => {
  const { data: { activeWidgets = [] } = {}, loading } = useQuery(
    ACTIVE_WIDGETS_QUERY
  )

  return { activeWidgets, loading }
}

export const WebinarWidget = ({ webinar }) => {
  const videoId = extractYoutubeId(webinar.videoLink)
  const coverImage =
    webinar.imageLink || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <a
      href={webinar.videoLink}
      target='_blank'
      rel='noopener noreferrer'
      className={styles.content}
    >
      <div
        className={styles.media}
        style={{ backgroundImage: `url('${coverImage}')` }}
      >
        <DarkVideoPlayBtn />
      </div>
      <div className={styles.info}>
        <h4 className={styles.title}>{webinar.title}</h4>
        <p className={styles.desc}>{webinar.description}</p>
      </div>
    </a>
  )
}

const EventBanner = ({ className }) => {
  const { activeWidgets } = useActiveWebinars()
  const [isShowMeetupBanner, setIsShowMeetupDate] = useState(false)
  const activeWidget = activeWidgets.length > 0 ? activeWidgets[0] : null

  const [show, setShow] = useState(false)
  const [showCloseAnimation, setShowCloseAnimation] = useState(false)

  useEffect(
    () => {
      setShow(canShowWidget(activeWidget))
    },
    [activeWidget]
  )

  useEffect(() => {
    const currDate = new Date()
    setIsShowMeetupDate(currDate < FINISH_MEETUP_DATE)
  }, [])

  const hideTooltip = () => {
    localStorage.setItem(HIDDEN_WIDGET_KEY, JSON.stringify(activeWidget))
    setShowCloseAnimation(true)
    setTimeout(() => {
      setShow(false)
      setShowCloseAnimation(false)
    }, 1000)
  }

  if (isShowMeetupBanner) return <MeetupWidget />

  if (!show || !activeWidget) {
    return null
  }

  return (
    <section
      className={cx(
        styles.wrapper,
        className,
        showCloseAnimation && styles.wrapper__hide
      )}
    >
      <div
        className={cx(
          styles.closeContainer,
          showCloseAnimation && styles.closeContainer__hide
        )}
      >
        <WebinarWidget webinar={activeWidget} />
        <Icon
          type='close-medium'
          className={styles.close}
          onClick={hideTooltip}
        />
      </div>
    </section>
  )
}

export default EventBanner
