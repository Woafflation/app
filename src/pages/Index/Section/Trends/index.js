import React, { useState } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { Section } from '../index'
import SocialGrid from '../../../../components/SocialGrid'
import { INDEX_PAGE_GROUPS } from '../../../../components/SocialGrid/topics'
import Santrends from '../../../../components/Trends/Trends'
import { Column } from '../../../../ducks/TrendsTable/columns'
import styles from './index.module.scss'

const RECENT_SOCIAL_TRENDS = INDEX_PAGE_GROUPS[0]
const TRENDS_HIDDEN_COLUMNS = [Column.SOCIAL_VOLUME]

const TabType = {
  SOCIAL_TRENDS: 'Social Trends',
  SANTRENDS: 'Santrends'
}

const TabTypeContent = {
  [TabType.SOCIAL_TRENDS]: {
    href: '/labs/trends/explore/',
    widget: (
      <>
        <h4 className={styles.title}>{RECENT_SOCIAL_TRENDS.title}</h4>
        <p className={styles.text}>{RECENT_SOCIAL_TRENDS.description}</p>
        <SocialGrid
          className={styles.socialgrid}
          topics={RECENT_SOCIAL_TRENDS.topics}
        />
      </>
    ),
    description:
      '‘Google Trends’ for crypto. Monitor the interest in any topic on dedicated cryptocurrency social channels, including 1000+ Telegram groups, Discord servers, crypto subreddits, Twitter accounts and more.'
  },

  [TabType.SANTRENDS]: {
    href: '/labs/trends/',
    widget: (
      <Santrends
        className={styles.santrends}
        hiddenColumnIds={TRENDS_HIDDEN_COLUMNS}
      />
    ),
    description: (
      <>
        Track the top emerging topics on crypto social media, including Telegram
        groups, crypto subreddits, Twitter and more
      </>
    )
  }
}

export const Tab = ({
  tab,
  tabState,
  notActive,
  className,
  as: El = 'div',
  ...rest
}) => (
  <El
    className={cx(
      styles.tab,
      tab !== tabState[0] && styles.tab_inactive,
      className
    )}
    onClick={() => tabState[1](tab)}
    {...rest}
  >
    {tab}
  </El>
)

const Tabs = ({ tabState }) => (
  <>
    <Tab tab={TabType.SANTRENDS} tabState={tabState} />
    <Tab tab={TabType.SOCIAL_TRENDS} tabState={tabState} />
  </>
)

const Trends = () => {
  const tabState = useState(TabType.SANTRENDS)
  const activeTab = tabState[0]
  const { href, description, widget } = TabTypeContent[activeTab]

  return (
    <Section title={<Tabs tabState={tabState} />} className={styles.wrapper}>
      <div className={styles.description}>{description}</div>
      <Link to={href} className={styles.link}>
        Start researching {activeTab}
      </Link>
      {widget}
    </Section>
  )
}

export default Trends
