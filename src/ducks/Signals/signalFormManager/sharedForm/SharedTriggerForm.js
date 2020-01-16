import React from 'react'
import Button from '@santiment-network/ui/Button'
import { couldShowChart } from '../../utils/utils'
import SignalPreview from '../../chart/SignalPreview'
import SignalCard from '../../../../components/SignalCard/card/SignalCard'
import NoSignalPreview from '../../chart/NoSignalPreview'
import { DesktopOnly, MobileOnly } from '../../../../components/Responsive'
import styles from './ShareTriggerForm.module.scss'
import CopySignal from '../../../../components/SignalCard/controls/CopySignal'

const SharedTriggerForm = ({ id, trigger, onOpen, onCreate, settings }) => {
  const { target, metric } = settings
  const showChart = target && couldShowChart(settings)

  return (
    <div className={styles.container}>
      <SignalCard
        id={id}
        signal={trigger}
        showMoreActions={false}
        className={styles.cardPanel}
        showStatus={false}
        isSharedTriggerForm={true}
      />

      <div className={styles.backTesting}>
        {showChart ? (
          <>
            <div className={styles.chartDivider} />
            <div className={styles.preview}>
              <SignalPreview trigger={trigger} type={metric.value} />
            </div>
          </>
        ) : (
          <NoSignalPreview />
        )}
      </div>

      <div className={styles.actions}>
        <DesktopOnly>
          <CopySignal
            signal={trigger}
            label='Add signal'
            onCreate={onCreate}
            classes={styles}
            as='div'
            btnParams={{ variant: 'fill', accent: 'positive' }}
          />
          <Button
            className={styles.btnEdit}
            onClick={() => onOpen(false)}
            border
          >
            Edit signal
          </Button>
        </DesktopOnly>

        <MobileOnly>
          <CopySignal
            signal={trigger}
            label='Add signal'
            onCreate={onCreate}
            classes={styles}
            as='div'
            btnParams={{ fluid: true, accent: 'positive' }}
          />
          <Button
            fluid
            className={styles.btnEdit}
            onClick={() => onOpen(false)}
          >
            Edit signal
          </Button>
        </MobileOnly>
      </div>
    </div>
  )
}

export default SharedTriggerForm
