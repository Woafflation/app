import React, { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { DEFAULT_INSIGHTS_PER_PAGE, useInsightsBy } from '../../hooks/insights'
import NoInsights from '../Studio/RelatedInsights/NoInsights'
import InsightsFeed from '../../components/Insight/InsightsFeed'
import { Skeleton } from '../../components/Skeleton'
import styles from '../Studio/RelatedInsights/RelatedInsights.module.scss'

export const useScrollabelPages = () => {
  const [page, setPage] = useState(1)

  return { page, setPage }
}

export const ScrollableInsightsList = ({
  variables,
  query,
  setPage,
  page,
  settings,
  target
}) => {
  const [insights, setInsights] = useState([])
  const [canLoad, setCanLoad] = useState(true)

  const { data, loading: isLoading } = useInsightsBy(variables, query)

  useEffect(() => {
    setPage(1)
    setInsights([])
  }, [settings])

  useEffect(() => {
    if (data.length > 0) {
      setInsights([...insights, ...data])
    }

    if (
      !isLoading &&
      (data.length === 0 || data.length < DEFAULT_INSIGHTS_PER_PAGE)
    ) {
      setCanLoad(false)
    }
  }, [data])

  const loadMore = useCallback(() => {
    if (!isLoading && canLoad) {
      setPage(page + 1)
    }
  }, [isLoading, canLoad, setPage, page])

  return (
    <>
      {!isLoading && insights.length === 0 && data.length === 0 && (
        <NoInsights target={target} />
      )}

      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={!isLoading && canLoad}
        loader={
          <Skeleton show={isLoading} key='loader' className={styles.skeleton} />
        }
        threshold={0}
      >
        <InsightsFeed key='feed' insights={insights} classes={styles} />
      </InfiniteScroll>
    </>
  )
}

export default ScrollableInsightsList
