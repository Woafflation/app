import React, { useState, useEffect } from 'react'
import { logScale, linearScale } from '@santiment-network/chart/scales'
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
  defaultPriceAssets,
  isDesktop,
}) => {
  const [settings, setSettings] = useState(defaultSettings)
  const { walletAssets, isLoading, isError } = useWalletAssets(settings.address)
  const [chartAssets, setChartAssets] = useState(defaultChartAssets)
  const [priceAssets, setPriceAssets] = useState(defaultPriceAssets)
  const [isLog, setIsLog] = useState(false)
  const metrics = useWalletMetrics(chartAssets, priceAssets)

  useEffect(() => {
    const priceAssetsSet = new Set(priceAssets)
    const priceAssetsToDelete = new Set(priceAssetsSet)

    chartAssets.forEach(({ slug }) => priceAssetsToDelete.delete(slug))
    priceAssetsToDelete.forEach((asset) => priceAssetsSet.delete(asset))

    setPriceAssets([...priceAssetsSet])
  }, [chartAssets])

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

  function togglePriceAsset(asset) {
    const priceAssetsSet = new Set(priceAssets)

    if (priceAssetsSet.has(asset)) {
      priceAssetsSet.delete(asset)
    } else {
      priceAssetsSet.add(asset)
    }

    setPriceAssets([...priceAssetsSet])
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
        isLog={isLog}
        settings={settings}
        chartAssets={chartAssets}
        priceAssets={priceAssets}
        isDesktop={isDesktop}
        togglePriceAsset={togglePriceAsset}
        changeTimePeriod={changeTimePeriod}
        setIsLog={setIsLog}
      >
        <Chart
          scale={isLog ? logScale : linearScale}
          settings={settings}
          metrics={metrics}
          isDesktop={isDesktop}
        ></Chart>
      </Configurations>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          settings,
          chartAssets,
          priceAssets,
        }),
      )}
    </div>
  )
}

HistoricalBalance.defaultProps = {
  defaultChartAssets: [],
  defaultPriceAssets: [],
}

export default withDefaults(withSizes(HistoricalBalance))
