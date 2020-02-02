import React from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import Selector from '@santiment-network/ui/Selector/Selector'
import ChartSettingsContextMenu from './ChartSettingsContextMenu'
import CalendarBtn from '../../components/Calendar/CalendarBtn'
import { getTimeIntervalFromToday, DAY } from '../../utils/dates'
import ChartExpandBtn from './expand/ChartExpandBtn'
import sanbaseLogoImg from '../../assets/logos/logo-sanbase.svg'
import { capitalizeStr } from '../../utils/utils'
import styles from './ChartPage.module.scss'

const { to: MAX_DATE } = getTimeIntervalFromToday(0, DAY)

const ChartSettings = ({
  chartRef,
  title,
  onTimerangeChange,
  timeRange,
  onCalendarChange,
  generateShareLink,
  onNightModeSelect,
  isNightModeActive,
  showNightModeToggle = true,
  disabledMetrics,
  from,
  to,
  isAdvancedView,
  activeMetrics,
  isLogScale,
  onMultiChartsChange,
  isMultiChartsActive,
  onScaleChange,
  chartData,
  events,
  eventsData,
  isFullscreenAvailable = true
}) => {
  const shareLink = generateShareLink(disabledMetrics)

  const notAdvancedView = !isAdvancedView
  return (
    <div className={styles.settings}>
      <div className={styles.settings__group}>
        {/* <img src={sanbaseLogoImg} alt='studio logo' className={styles.logo} /> */}
        <div className={styles.settings__slugBlock}>
          <div className={styles.settings__studio}>Studio</div>
          <div className={styles.settings__slug}>{title}</div>
        </div>
      </div>
      <div className={cx(styles.settings__group, styles.settings__main)}>
        <Selector
          options={['1d', '1w', '1m', '3m', '6m', '1y', 'all']}
          onSelectOption={onTimerangeChange}
          defaultSelected={timeRange}
          className={styles.ranges}
        />
        {notAdvancedView && (
          <CalendarBtn
            onChange={onCalendarChange}
            value={[new Date(from), new Date(to)]}
            className={styles.calendar}
            maxDate={MAX_DATE}
          />
        )}
        <ChartSettingsContextMenu
          onMultiChartsChange={onMultiChartsChange}
          isMultiChartsActive={isMultiChartsActive}
          isNightModeActive={isNightModeActive}
          showNightModeToggle={showNightModeToggle}
          onNightModeSelect={onNightModeSelect}
          shareLink={shareLink}
          activeMetrics={activeMetrics}
          title={title}
          chartRef={chartRef}
          isLogScale={isLogScale}
          onScaleChange={onScaleChange}
          chartData={chartData}
          events={events}
          eventsData={eventsData}
        />
        {isFullscreenAvailable && <ChartExpandBtn />}
      </div>
    </div>
  )
}

const mapStateToProps = ({ rootUi: { isWideChartEnabled } }) => ({
  isWideChart: isWideChartEnabled
})

export default connect(mapStateToProps)(ChartSettings)
