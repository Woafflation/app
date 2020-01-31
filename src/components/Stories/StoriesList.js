import React, { useState } from 'react'
import cx from 'classnames'
import Dialog from '@santiment-network/ui/Dialog'
import Icon from '@santiment-network/ui/Icon'
import StoryPreview from './StoryPreview'
import GA from './../../utils/tracking'
import Story from './Story'
import { stories } from './content'
import styles from './StoriesList.module.scss'
import { DesktopOnly } from '../Responsive'

const ScrollBtn = ({ isRight, show = true, onClick }) => {
  if (!show) {
    return null
  }

  return (
    <div
      className={cx(styles.scrollBtn, isRight && styles.btnRight)}
      onClick={onClick}
    >
      <Icon
        type={isRight ? 'arrow-right' : 'arrow-left'}
        className={styles.scrollIcon}
      />
    </div>
  )
}

const SCROLL_OFFSET = 300

const StoriesList = ({ classes = {}, showScrollBtns }) => {
  const [selected, setSelected] = useState()

  const [canScrollLeft, setLeft] = useState(false)
  const [canScrollRight, setRight] = useState(true)
  const scrollRef = React.createRef()

  const scroll = isRight => {
    scrollRef.current.scrollLeft += (isRight ? 1 : -1) * SCROLL_OFFSET
    setTimeout(() => {
      if (scrollRef && scrollRef.current) {
        const current = scrollRef.current
        setLeft(current.scrollLeft > 0)
        setRight(
          current.scrollWidth - current.clientWidth - current.scrollLeft > 0
        )
      }
    }, 500)
  }

  return (
    <section className={cx(styles.list, classes.stories)}>
      <DesktopOnly>
        {showScrollBtns && canScrollLeft && (
          <ScrollBtn
            onClick={() => {
              scroll(false)
            }}
          />
        )}
      </DesktopOnly>

      <div className={styles.scrollableWrapper} ref={scrollRef}>
        <div className={cx(styles.scrollable, classes.storiesScrollable)}>
          {stories.map(story => (
            <StoryPreview
              className={cx(styles.item, classes.story)}
              key={story.previewTitle}
              onClick={() => {
                GA.event({
                  category: 'Stories',
                  action: `Opened "${story.previewTitle}" story `
                })
                setSelected(story)
              }}
              {...story}
            />
          ))}
        </div>
      </div>

      <DesktopOnly>
        {showScrollBtns && canScrollRight && (
          <ScrollBtn
            isRight
            onClick={() => {
              scroll(true)
            }}
          />
        )}
      </DesktopOnly>

      <Dialog
        title={(selected || {}).storyHeaderName || ''}
        open={!!selected}
        onClose={setSelected}
        classes={styles}
      >
        <Dialog.ScrollContent className={styles.content}>
          <Story story={selected} onEnd={setSelected} />
        </Dialog.ScrollContent>
      </Dialog>
    </section>
  )
}

export default StoriesList
