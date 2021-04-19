import React, { useState } from 'react'
import cx from 'classnames'
import Icon from '@santiment-network/ui/Icon'
import { MAIN_PRODUCTS } from './Products'
import LinkWithArrow from '../Link'
import SmoothDropdownItem from '../../SmoothDropdown/SmoothDropdownItem'
import styles from './SantimentProductsTooltip.module.scss'

const ProductItem = ({
  product: { to, img, Icon, title, description, showLink = true },
  className,
  imgClassName
}) => {
  return (
    <a
      className={cx(styles.wrapper, className)}
      href={to}
      target='_blank'
      rel='noopener noreferrer'
    >
      <div className={cx(styles.product, styles.wrapper__product)}>
        {img && (
          <img
            className={cx(styles.product__img, imgClassName)}
            src={img}
            alt={title}
          />
        )}
        {Icon && <Icon className={cx(styles.product__img, imgClassName)} />}
        <div className={styles.product__info}>
          <div className={styles.product__title}>{title}</div>
          <div className={styles.product__description}>{description}</div>

          {showLink && (
            <LinkWithArrow
              className={cx(styles.wrapper__link)}
              to={to}
              as='div'
              title={'Go to ' + title}
            />
          )}
        </div>
      </div>
    </a>
  )
}

const OpenTrigger = () => (
  <Icon type='arrow-down' className={styles.arrowIcon} />
)
const CloseTrigger = () => <Icon type='arrow-up' className={styles.arrowIcon} />

export const MenuItemArrow = ({ isOpen, className }) => (
  <div className={cx(styles.arrow, className, isOpen && styles.opened)}>
    {isOpen ? <CloseTrigger /> : <OpenTrigger />}
  </div>
)

let timeoutId

const SantimentProductsTooltip = ({
  showArrows = true,
  position = 'start',
  showHeader = true,
  className,
  children,
  products = MAIN_PRODUCTS,
  offsetY = 0,
  offsetX = 0,
  productProps = {},
  imgClassName
}) => {
  const [isOpen, setOpenState] = useState(false)

  const setClosed = () => {
    timeoutId = setTimeout(() => setOpenState(false), 150)
  }

  const setOpened = () => {
    timeoutId && clearTimeout(timeoutId)
    setOpenState(true)
  }

  return (
    <SmoothDropdownItem
      className={cx(styles.tooltip, className)}
      trigger={showArrows && <MenuItemArrow isOpen={isOpen} />}
      onOpen={() => setOpened()}
      onClose={() => setClosed()}
      ddParams={{
        position,
        offsetX,
        offsetY
      }}
    >
      <div
        className={styles.container}
        onMouseEnter={() => setOpened()}
        onMouseLeave={() => setClosed()}
      >
        {showHeader && (
          <div className={styles.header}>
            <div className={styles.title}>Santiment products</div>
            <LinkWithArrow
              to='https://santiment.net'
              title='Go to Santiment.net'
            />
          </div>
        )}
        <div className={styles.products}>
          {products.map((item, index) => (
            <ProductItem
              key={index}
              product={item}
              {...productProps}
              imgClassName={imgClassName}
            />
          ))}
        </div>
      </div>
    </SmoothDropdownItem>
  )
}

export default SantimentProductsTooltip
