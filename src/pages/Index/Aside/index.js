import React from 'react'
import Section from './Section'
import Recents from './Recents'
import FeaturedWatchlists from '../../../ducks/Watchlists/Cards/Featured'
import Conversations from '../Conversations/Conversations'
import styles from './index.module.scss'

const Aside = ({ className }) => (
  <aside className={className}>
    <Recents />
    <Section title='Conversations'>
      <Conversations />
    </Section>
    <Section title='Indices'>
      <FeaturedWatchlists className={styles.watchlist} />
    </Section>
  </aside>
)

export default Aside
