import React, { useState } from 'react'
import { withDefaults } from './defaults'
import { useWalletAssets, useWalletMetrics } from './hooks'
import Chart from './Chart'
import Configurations from './Configurations'
import AddressSetting from './Setting/Address'
import AssetsSetting from './Setting/Assets'
import { getNewInterval, INTERVAL_ALIAS } from '../SANCharts/IntervalSelector'
import { withSizes } from '../../components/Responsive'
import styles from './index.module.scss'

const HistoricalBalance = ({
  children,
  defaultSettings,
  defaultChartAssets,
  isDesktop,
}) => {
  const [settings, setSettings] = useState(defaultSettings)
  const { walletAssets, isLoading, isError } = useWalletAssets(settings.address)
  const [chartAssets, setChartAssets] = useState(defaultChartAssets)
  const metrics = useWalletMetrics(chartAssets)

  function onAddressChange(address) {
    setSettings({
      ...settings,
      address,
    })
  }

  function changeTimePeriod(from, to, timeRange) {
    const interval = getNewInterval(from, to)

    setSettings((state) => ({
      ...state,
      timeRange,
      interval: INTERVAL_ALIAS[interval] || interval,
      from: from.toISOString(),
      to: to.toISOString(),
    }))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.settings}>
        <AddressSetting
          address={settings.address}
          isError={isError}
          onAddressChange={onAddressChange}
        ></AddressSetting>
        <AssetsSetting
          walletAssets={walletAssets}
          chartAssets={chartAssets}
          isLoading={isLoading}
          setChartAssets={setChartAssets}
        ></AssetsSetting>
      </div>
      <Configurations
        settings={settings}
        chartAssets={chartAssets}
        changeTimePeriod={changeTimePeriod}
        isDesktop={isDesktop}
      >
        <Chart
          settings={settings}
          metrics={metrics}
          isDesktop={isDesktop}
        ></Chart>
      </Configurations>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          settings,
          chartAssets,
          //priceAssets
        }),
      )}
    </div>
  )
}

HistoricalBalance.defaultProps = {
  defaultChartAssets: [],
}

export default withDefaults(withSizes(HistoricalBalance))
