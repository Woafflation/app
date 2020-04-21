import React from 'react'
import styles from './NonProBanner.module.scss'
import UpgradeBtn from "../../../components/UpgradeBtn/UpgradeBtn";

const NonProBanner = () => {
  return <div className={styles.banner}>

    <div className={styles.title}>Why those reports are hidden?</div>
    <div className={styles.description}>
      To unlock the full potential of Santiment metrics you need to upgrade your account to PRO
    </div>

    <UpgradeBtn/>
  </div>
}

export default NonProBanner
