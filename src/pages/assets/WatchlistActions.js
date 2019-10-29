import React from 'react'
import { CSVLink } from 'react-csv'
import Icon from '@santiment-network/ui/Icon'
import Button from '@santiment-network/ui/Button'
import { normalizeCSV } from './utils'
import { isNotSafari } from '../../utils/utils'
import { upperCaseFirstLetter } from '../../utils/formatting'
import ShareModalTrigger from '../../components/Share/ShareModalTrigger'
import WatchlistEditTrigger from '../../components/WatchlistEdit/WatchlistEditTrigger'
import WatchlistWeeklyReportTrigger from '../../components/WatchlistWeeklyReport/WatchlistWeeklyReportTrigger'
import WatchlistCopyPopup from '../../components/WatchlistCopy/WatchlistCopyPopup'
import WatchlistContextMenu from './WatchlistContextMenu'
import styles from './WatchlistActionButton.module.scss'

const WatchlistActions = ({
  isList,
  listType,
  shareLink,
  isAuthor,
  id,
  title: initialTitle,
  items,
  type,
  location,
  isDesktop,
  isLoggedIn,
  isMonitored
}) => {
  const hasCSV = isNotSafari && items && items.length > 0
  const title = upperCaseFirstLetter(initialTitle)

  return (
    <>
      {(!isList || (listType === '#shared' && !isAuthor) || !isLoggedIn) &&
      isDesktop ? (
        <>
          <WatchlistCopyPopup
            id={id}
            trigger={
              <Button border variant='flat'>
                <Icon type='copy' className={styles.icon} />
                <span className={styles.text}>Copy</span>
              </Button>
            }
          />
          {hasCSV && (
            <CSVLink
              data={normalizeCSV(items)}
              filename={`${title}.csv`}
              target='_blank'
            >
              <Button border variant='flat'>
                <Icon type='save' className={styles.icon} />
                <span className={styles.text}>Download .csv</span>
              </Button>
            </CSVLink>
          )}
        </>
        ) : (
        <>
          {isLoggedIn && (
            <WatchlistContextMenu
              isAuthor={isAuthor}
              id={id}
              name={title}
              assets={items}
              type={type}
              location={location}
              hasCSV={hasCSV}
              isDesktop={isDesktop}
              isMonitored={isMonitored}
            />
          )}
          {isDesktop && (
            <>
              <ShareModalTrigger shareLink={shareLink} />
              {isAuthor && (
                <>
                  <WatchlistEditTrigger name={title} id={id} assets={items} />
                  <WatchlistWeeklyReportTrigger
                    id={id}
                    name={title}
                    isMonitored={isMonitored}
                  />
                </>
              )}
            </>
          )}
        </>
        )}
    </>
  )
}

export default WatchlistActions
