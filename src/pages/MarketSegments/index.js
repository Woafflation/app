import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Tabs from '@santiment-network/ui/Tabs'
import { graphql, Query } from 'react-apollo'
import ChartWidget from '../../ducks/SANCharts/ChartPage'
import AssetsTable from '../assets/AssetsTable'
import { CATEGORIES_SETTINGS } from '../assets/asset-columns'
import { Metrics, getMarketSegment } from '../../ducks/SANCharts/utils'
import { MARKET_SEGMENTS_FETCH } from './actions'
import styles from './index.module.scss'

const hideSettings = {
  header: true,
  metricSelector: true,
  sidecar: true
}

const marketSegments = [
  getMarketSegment('Ethereum'),
  getMarketSegment('DeFi'),
  getMarketSegment('EOS')
]
// "ERC20 Assets"

const Segment = {
  All: marketSegments,
  ERC20: [marketSegments[0]],
  DeFi: [marketSegments[1]],
  EOS: [marketSegments[2]]
}

const TABS = ['All', 'ERC20', 'DeFi', 'EOS']

const MarketSegmentsPage = ({
  assets,
  loading,
  isLoggedIn,
  location,
  history,
  fetchAssets
}) => {
  const [segment, setSegment] = useState('DeFi')

  function changeSegment (segment) {
    setSegment(segment)
  }

  useEffect(
    () => {
      fetchAssets(segment)
    },
    [segment]
  )

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.content + ' page'}>
          <ChartWidget
            enabledViewOnlySharing={false}
            adjustNightMode={false}
            showToggleAnomalies={false}
            metrics={[]}
            marketSegments={Segment[segment]}
            classes={styles}
            isLoggedIn={isLoggedIn}
            isControlled
            hideSettings={hideSettings}
            hasPremium={true}
            isPRO={true}
          />
          <Tabs
            options={TABS}
            defaultSelectedIndex={segment}
            onSelect={changeSegment}
            className={styles.tabs}
          />
          <AssetsTable
            items={assets}
            Assets={{ typeInfo: '', isLoading: loading }}
            listName='Market Segments'
            settings={CATEGORIES_SETTINGS}
          />
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  ...state.marketSegments
})

const mapDispatchToProps = dispatch => ({
  fetchAssets: payload =>
    dispatch({
      type: MARKET_SEGMENTS_FETCH,
      payload
    })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketSegmentsPage)
