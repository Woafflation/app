import React, { useState } from 'react'
import cx from 'classnames'
import Icon from '@santiment-network/ui/Icon'
import FormDialogNewTemplate from './FormDialog/NewTemplate'
import LoginDialog from '../../../components/LoginDialog'
import styles from './index.module.scss'

export default ({
  forwardedRef,
  selectedTemplate,
  hasTemplates,
  isMenuOpened,
  isLoggedIn,
  saveTemplate,
  openMenu,
  onNewTemplate,
  ...props
}) => {
  const [isDialogOpened, setIsDialogOpened] = useState(false)

  function openDialog () {
    setIsDialogOpened(true)
  }

  function closeDialog () {
    setIsDialogOpened(false)
  }

  function onNew (template) {
    onNewTemplate(template)
    closeDialog()
  }

  const Dialog = isLoggedIn ? FormDialogNewTemplate : LoginDialog

  return (
    <button className={styles.btn} ref={forwardedRef}>
      <Dialog
        {...props}
        title='New Template'
        open={isDialogOpened}
        onClose={closeDialog}
        onNew={onNew}
        trigger={
          <div
            onClick={selectedTemplate ? saveTemplate : openDialog}
            className={cx(
              styles.btn__left,
              !hasTemplates && styles.btn__left_large
            )}
          >
            <Icon type='cloud-small' className={styles.cloud} />
            {selectedTemplate ? selectedTemplate.title : 'New Template'}
          </div>
        }
      />
      {hasTemplates && (
        <div className={styles.dropdown} onClick={openMenu}>
          <Icon
            type='arrow-down'
            className={cx(styles.icon, isMenuOpened && styles.active)}
          />
        </div>
      )}
    </button>
  )
}
