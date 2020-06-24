import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import Button from '@santiment-network/ui/Button'
import Icon from '@santiment-network/ui/Icon'
import ContextMenu from '@santiment-network/ui/ContextMenu'
import Panel from '@santiment-network/ui/Panel'
import Comparable from './Comparable'
import withProjects from './withProjects'
import { projectSorter, hashComparable, buildHiddenMetrics } from './utils'
import { MAX_METRICS_AMOUNT } from '../constraints'
import { FIAT_MARKET_ASSETS } from '../../dataHub/fiat'
import { useChartColors } from '../../Chart/colors'
import styles from './index.module.scss'

const Compare = ({
  slug,
  allProjects,
  comparables,
  activeMetrics,
  className,
  MetricColor,
  ...rest
}) => {
  const [projects, setProjects] = useState(allProjects)
  /* const MetricColor = useChartColors(activeMetrics) */

  useEffect(
    () => {
      setProjects(
        allProjects
          .concat(FIAT_MARKET_ASSETS)
          .filter((project) => project.slug !== slug)
          .sort(projectSorter),
      )
    },
    [allProjects, slug],
  )

  const canSelectMoreMetrics =
    /* rest.options.isMultiChartsActive || */
    activeMetrics.length < MAX_METRICS_AMOUNT

  const hiddenMetricsMap = buildHiddenMetrics(comparables)

  return (
    <ContextMenu
      passOpenStateAs='isActive'
      position='bottom'
      align='end'
      trigger={
        <Button border className={cx(styles.btn, className)} classes={styles}>
          <Icon type='compare' className={styles.icon} />
          Compare
        </Button>
      }
    >
      <Panel variant='modal' padding>
        <div>Compare with</div>
        {comparables.map((comparable) => (
          <Comparable
            {...rest}
            {...comparable}
            key={hashComparable(comparable)}
            projects={projects}
            comparable={comparable}
            colors={MetricColor}
            hiddenMetricsMap={hiddenMetricsMap}
            activeSlug={slug}
          />
        ))}
        {canSelectMoreMetrics ? (
          <Comparable
            {...rest}
            projects={projects}
            colors={MetricColor}
            hiddenMetricsMap={hiddenMetricsMap}
            activeSlug={slug}
          />
        ) : (
          <div className={styles.info}>
            You have selected the maximum amount of metrics
          </div>
        )}
      </Panel>
    </ContextMenu>
  )
}

export default withProjects(Compare)
