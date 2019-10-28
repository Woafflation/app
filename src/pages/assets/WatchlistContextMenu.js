import React from 'react'
import { CSVLink } from 'react-csv'
import ContextMenu from '@santiment-network/ui/ContextMenu'
import Icon from '@santiment-network/ui/Icon'
import Button from '@santiment-network/ui/Button'
import Panel from '@santiment-network/ui/Panel/Panel'
import { normalizeCSV } from './utils'
import WatchlistDeleteDialog from './WatchlistDeleteDialog'
import WatchlistEdit from '../../components/WatchlistEdit/WatchlistEdit'
import WatchlistWeeklyReport from '../../components/WatchlistWeeklyReport/WatchlistWeeklyReport'
import WatchlistCopyPopup from '../../components/WatchlistCopy/WatchlistCopyPopup'
import WatchlistPublicityToggle from '../../components/WatchlistShare/WatchlistShare'
import styles from './WatchlistContextMenu.module.scss'

const WatchlistContextMenu = ({
  isAuthor,
  assets,
  id,
  hasCSV,
  isDesktop,
  name,
  isMonitored
}) => {
  if (!(isAuthor || hasCSV)) return null

  return (
    <ContextMenu
      trigger={
        <Button variant='flat'>
          <Icon type='dots' />
        </Button>
      }
      passOpenStateAs='isActive'
      position='bottom'
      align='end'
    >
      <Panel variant='modal' className={styles.wrapper}>
        {isAuthor && (
          <div className={styles.block}>
            <WatchlistPublicityToggle />
          </div>
        )}
        <div className={styles.block}>
          {!isDesktop && isAuthor && (
            <WatchlistEdit
              id={id}
              assets={assets}
              name={name}
              trigger={
                <Button variant='ghost' fluid>
                  Edit
                </Button>
              }
            />
          )}
          <WatchlistCopyPopup
            id={id}
            trigger={
              <Button variant='ghost' fluid>
                Copy assets to ...
              </Button>
            }
          />
          {!isDesktop && isAuthor && (
            <WatchlistWeeklyReport
              id={id}
              isMonitored={isMonitored}
              trigger={
                <Button variant='Sghost' fluid>
                  Weekly report
                </Button>
              }
            />
          )}
          {hasCSV && isDesktop && (
            <CSVLink
              data={normalizeCSV(assets)}
              filename={`${name}.csv`}
              target='_blank'
            >
              <Button variant='ghost' fluid>
                Download .csv
              </Button>
            </CSVLink>
          )}
          {isAuthor && (
            <WatchlistDeleteDialog
              id={id}
              trigger={
                <Button variant='ghost' fluid>
                  Delete
                </Button>
              }
            />
          )}
        </div>
      </Panel>
    </ContextMenu>
  )
}

export default WatchlistContextMenu
