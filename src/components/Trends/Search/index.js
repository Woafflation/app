import React, { Component } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import Input from '@santiment-network/ui/Input'
import Button from '@santiment-network/ui/Button'
import { gotoExplore } from './utils.js'
import styles from './index.module.scss'

export class TrendsSearchForm extends Component {
  static defaultProps = {
    classes: {}
  }

  state = {
    topic: this.props.defaultTopic || ''
  }

  componentDidUpdate (prevProps) {
    if (this.props.defaultTopic !== prevProps.defaultTopic) {
      this.setState({ topic: this.props.defaultTopic })
    }
  }

  handleSubmit = evt => {
    evt.preventDefault()
    this.props.gotoExplore(this.state.topic)
  }

  handleChange = evt => {
    this.setState({ topic: evt.currentTarget.value })
  }

  render () {
    const {
      classes: { wrapper: className, input: inputClassName },
      withButton,
      isMulti
    } = this.props

    return (
      <form
        onSubmit={this.handleSubmit}
        className={cx(styles.wrapper, className)}
      >
        <Input
          className={cx(
            styles.input,
            inputClassName,
            withButton && styles.withButton
          )}
          placeholder='Enter a word or a phrase...'
          value={this.state.topic}
          onChange={this.handleChange}
        />
        {withButton && (
          <Button
            type='submit'
            variant='fill'
            accent='positive'
            className={styles.button}
          >
            Go
          </Button>
        )}
      </form>
    )
  }
}

export default connect(
  null,
  gotoExplore
)(TrendsSearchForm)
