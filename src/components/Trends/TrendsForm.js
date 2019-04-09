import React, { Component } from 'react'
import Raven from 'raven-js'
import axios from 'axios'
import GoogleAnalytics from 'react-ga'
import { connect } from 'react-redux'
import { Search } from '@santiment-network/ui'
import { gotoExplore } from './trendsUtils'

export class TrendsForm extends Component {
  state = {
    topic: this.props.defaultTopic || ''
  }

  handleSubmit = evt => {
    evt.preventDefault()
    trackTopicSearch(this.state.topic)
    this.props.gotoExplore(window.encodeURIComponent(this.state.topic))
  }

  handleChange = evt => {
    this.setState({ topic: evt.target.value })
  }

  render () {
    const { inputClassName, className } = this.props
    return (
      <form onSubmit={this.handleSubmit} className={className}>
        <Search
          inputClassName={inputClassName}
          iconPosition='left'
          placeholder='Enter a search word or phrase'
          value={this.state.topic}
          onChange={this.handleChange}
        />
      </form>
    )
  }
}

const trackTopicSearch = topic => {
  if (process.env.NODE_ENV === 'production') {
    try {
      axios({
        method: 'post',
        url:
          'https://us-central1-sanbase-search-ea4dc.cloudfunctions.net/trackTrends',
        headers: {
          authorization: ''
        },
        data: { topic }
      })
    } catch (error) {
      Raven.captureException(
        'tracking search trends queries ' + JSON.stringify(error)
      )
    }
    GoogleAnalytics.event({
      category: 'Trends Search',
      action: 'Search: ' + topic
    })
  }
}

export default connect(
  null,
  gotoExplore
)(TrendsForm)
