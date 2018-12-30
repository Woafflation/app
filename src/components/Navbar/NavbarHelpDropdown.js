import React from 'react'
import { Link } from 'react-router-dom'
import styles from './NavbarHelpDropdown.module.scss'
import GhostBtn from './GhostBtn'
import Dropdown from './Dropdown'

const links = [
  { link: '/', label: 'Documentation' },
  { link: '/', label: 'Developer API' },
  { link: '/', label: 'Support' }
]

const NavbarHelpDropdown = () => {
  return (
    <Dropdown>
      <div className={styles.list}>
        {links.map(({ link, label }) => {
          return (
            <GhostBtn
              key={label}
              fluid
              as={Link}
              className={styles.item + ' ' + styles.text}
              to={link}
            >
              {label}
            </GhostBtn>
          )
        })}
      </div>
    </Dropdown>
  )
}

export default NavbarHelpDropdown
