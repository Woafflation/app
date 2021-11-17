import React from 'react'
import Actions from './Actions/index'
import styles from './CompareInfo.module.scss'

const CompareInfo = ({
  type,
  selected,
  cleanAll,
  watchlist,
  refetchAssets
}) => {
  return (
    <div className={styles.container}>
      {type === 'PROJECT' && (
        <Actions
          selected={selected}
          watchlist={watchlist}
          refetchAssets={refetchAssets}
        />
      )}

      <div className={styles.info}>
        <div className={styles.text}>
          {selected.length} asset{selected.length !== 1 ? 's are ' : ' is '}
          selected.
        </div>

        {selected.length > 0 && cleanAll && (
          <div className={styles.clean} onClick={cleanAll}>
            Clear all
          </div>
        )}
      </div>
    </div>
  )
}

export default CompareInfo
