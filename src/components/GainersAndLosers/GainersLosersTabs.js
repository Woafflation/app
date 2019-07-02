import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import Tabs from '@santiment-network/ui/Tabs'
import Label from '@santiment-network/ui/Label'
import Panel from '@santiment-network/ui/Panel/Panel'
import { TOP_SOCIAL_GAINERS_LOSERS_QUERY } from '../../ducks/GainersAndLosers/gainersLosersQuery'
import ProjectIcon from '../ProjectIcon'
import PercentChanges from '../PercentChanges'
import { DAY, getTimeIntervalFromToday } from '../../utils/dates'
import allProjects from '../../allProjects.json'
import styles from './GainersLosersTabs.module.scss'

const Item = ({ onProjectClick, showChange, ...project }) => {
  const { change, name, ticker } = project
  return (
    <div className={styles.project} onClick={() => onProjectClick(project)}>
      <ProjectIcon name={name} size={20} ticker={ticker} />
      <Label className={styles.name}>{ticker}</Label>
      {showChange && (
        <PercentChanges changes={change * 100} className={styles.changes} />
      )}
    </div>
  )
}

const TYPES = {
  gainers: 'Top gainers',
  losers: 'Top losers'
}

const tabs = [
  {
    index: TYPES.gainers,
    content: TYPES.gainers
  },
  {
    index: TYPES.losers,
    content: TYPES.losers
  }
]

const GainersLosersTabs = ({ gainers, losers, onProjectClick }) => {
  let [selectedTab, setSelectedTab] = useState(tabs[0].index)

  function handleSelectTab (tab) {
    if (tab !== selectedTab) {
      setSelectedTab(tab)
    }
  }

  const tabItems = selectedTab === TYPES.gainers ? gainers : losers

  return (
    <Panel>
      <Tabs
        className={styles.tabs}
        options={tabs}
        defaultSelectedIndex={selectedTab}
        onSelect={handleSelectTab}
      />
      <div className={styles.wrapper}>
        {tabItems.map((project, idx) => (
          <Item
            key={idx}
            {...project}
            onProjectClick={onProjectClick}
            showChange={tabItems === gainers}
          />
        ))}
      </div>
    </Panel>
  )
}

const withGainersLosers = graphql(TOP_SOCIAL_GAINERS_LOSERS_QUERY, {
  options: ({ timeWindow, size }) => {
    const { from, to } = getTimeIntervalFromToday(-2, DAY)
    return {
      variables: {
        size,
        from: from.toISOString(),
        to: to.toISOString(),
        timeWindow,
        status: 'ALL'
      }
    }
  },
  props: ({ data: { topSocialGainersLosers = [], loading } }) => {
    const { length } = topSocialGainersLosers
    const gainers = []
    const losers = []
    if (length > 0) {
      topSocialGainersLosers[length - 1].projects.forEach(project => {
        const { slug: projectSlug } = project
        const proj = {
          ...allProjects.find(({ slug }) => slug === projectSlug),
          ...project
        }
        if (project.status === 'GAINER') gainers.push(proj)
        if (project.status === 'LOSER') losers.push(proj)
      })
    }

    return { gainers, losers, isLoading: loading }
  }
})

export default withGainersLosers(GainersLosersTabs)
