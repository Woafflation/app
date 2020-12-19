import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { ASSETS_LIMIT, withDefaults } from './defaults'
import { useSettings, useWalletAssets } from './hooks'
import Chart from './Chart'
import AddressSetting from './Address'
import Comments from './Comments'
import LatestTransactions from './LatestTransactions/index.js'
import { withSizes } from '../../components/Responsive'
import styles from './index.module.scss'

const HistoricalBalance = ({
  children,
  defaultSettings,
  defaultChartAssets,
  defaultPriceAssets,
  defaultIsLog,
  isPhone
}) => {
  const { settings, changeTimePeriod, onAddressChange } = useSettings(
    defaultSettings
  )
  const { walletAssets, isLoading, isError } = useWalletAssets(settings)
  const [chartAssets, setChartAssets] = useState(defaultChartAssets)
  const [priceAssets, setPriceAssets] = useState(defaultPriceAssets)
  const [isLog, setIsLog] = useState(defaultIsLog)

  useEffect(
    () => {
      const priceAssetsSet = new Set(priceAssets)
      const priceAssetsToDelete = new Set(priceAssetsSet)

      chartAssets.forEach(({ slug }) => priceAssetsToDelete.delete(slug))
      priceAssetsToDelete.forEach(asset => priceAssetsSet.delete(asset))

      setPriceAssets([...priceAssetsSet])
    },
    [chartAssets]
  )

  function togglePriceAsset (asset) {
    const priceAssetsSet = new Set(priceAssets)

    if (priceAssetsSet.has(asset)) {
      priceAssetsSet.delete(asset)
    } else {
      priceAssetsSet.add(asset)
    }

    setPriceAssets([...priceAssetsSet])
  }

  function updateChartAssets (newChartAssets) {
    const { length } = newChartAssets
    if (length > ASSETS_LIMIT) return

    const lastAsset = newChartAssets[length - 1]
    if (chartAssets.length < length && lastAsset) {
      const { slug } = lastAsset
      if (!priceAssets.includes(slug)) {
        setPriceAssets([...priceAssets, slug])
      }
    }

    setChartAssets(newChartAssets)
  }

  return (
    <>
      <div className={cx(styles.settings, isPhone && styles.settings_phone)}>
        <AddressSetting
          settings={settings}
          chartAssets={chartAssets}
          isError={isError}
          onAddressChange={onAddressChange}
        />
      </div>

      <Chart
        height={isPhone ? 340 : 450}
        settings={settings}
        chartAssets={chartAssets}
        priceAssets={priceAssets}
        walletAssets={walletAssets}
        isPhone={isPhone}
        isLog={isLog}
        isLoading={isLoading}
        togglePriceAsset={togglePriceAsset}
        changeTimePeriod={changeTimePeriod}
        setChartAssets={updateChartAssets}
        setIsLog={setIsLog}
      />

      <div className={styles.bottom}>
        <div className={styles.left}>
          <Comments settings={settings} />
        </div>
        <div className={styles.right}>
          <LatestTransactions settings={settings} />
        </div>
      </div>

      {React.Children.map(children, child =>
        React.cloneElement(child, {
          settings,
          chartAssets,
          priceAssets,
          isLog
        })
      )}
    </>
  )
}

HistoricalBalance.defaultProps = {
  defaultChartAssets: [],
  defaultPriceAssets: [],
  defaultIsLog: false
}

export default withDefaults(withSizes(HistoricalBalance))
