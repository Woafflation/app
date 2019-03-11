import React from 'react'
import Raven from 'raven-js'
import { compose, withState } from 'recompose'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { withRouter, Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Post from './../../components/Post'
import { allInsightsGQL } from './../Insights/currentPollGQL'
import ErrorBoundary from './../../ErrorBoundary'
import { APP_DELETE_INSIGHT_DRAFT } from '../../actions/types.js'
import { getInsightTrendTagByDate } from '../../components/Insight/InsightsTrends'

const createPostGQL = gql`
  mutation createPost($title: String!, $text: String!, $tags: [String]) {
    createPost(title: $title, text: $text, tags: $tags) {
      id
      title
      text
      tags {
        name
      }
    }
  }
`

const updatePostGQL = gql`
  mutation updatePost(
    $id: ID!
    $title: String!
    $text: String!
    $tags: [String]
  ) {
    updatePost(id: $id, title: $title, text: $text, tags: $tags) {
      id
      title
      text
      tags {
        name
      }
    }
  }
`

const createNewPost = ({ createPost, post, user, history }) => {
  return createPost({
    variables: {
      title: post.title,
      text: post.text,
      tags: (window.location.search.includes('currentTrends')
        ? [{ label: getInsightTrendTagByDate(new Date()) }, ...post.tags]
        : post.tags
      ).map(tag => {
        return tag.label
      })
    },
    update: (store, { data: { createPost } }) => {
      const data = store.readQuery({ query: allInsightsGQL })
      data.allInsights.push(createPost)
      store.writeQuery({ query: allInsightsGQL, data })
    }
  })
    .then(data => {
      history.push('/insights/my')
    })
    .catch(error => {
      Raven.captureException(
        'User try to confirm new insight. ' + JSON.stringify(error)
      )
    })
}

const ConfirmPost = ({
  history,
  post,
  createPost,
  updatePost,
  user,
  isPending,
  onPending,
  deleteDraft
}) => {
  return (
    <ErrorBoundary>
      <div className='event-posts-new-step event-posts-step-confirm'>
        <Post
          votePost={() => {}}
          unvotePost={() => {}}
          gotoInsight={() => {}}
          user={user}
          {...post}
        />
        <div className='event-posts-step-control'>
          <Link
            to='/insights/new/title'
            className='event-posts-step-control__back-btn'
          >
            Back
          </Link>
          <Button
            positive
            disabled={isPending}
            onClick={() => {
              onPending(true)
              deleteDraft()
              if (post.id) {
                const variables = {
                  id: post.id,
                  title: post.title,
                  text: post.text,
                  tags: post.tags.map(({ label, name }) => {
                    return label || name
                  })
                }
                updatePost({ variables })
                  .then(data => {
                    history.push('/insights/my')
                  })
                  .catch(error => {
                    Raven.captureException(
                      'User try to update insight. ' + JSON.stringify(error)
                    )
                  })
              } else {
                createNewPost({ user, createPost, post, history })
              }
            }}
          >
            {isPending ? 'Waiting' : 'Click && Confirm'}
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user.data
  }
}
const mapDispatchToProps = dispatch => ({
  deleteDraft: () => dispatch({ type: APP_DELETE_INSIGHT_DRAFT })
})
const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withState('isPending', 'onPending', false),
  graphql(createPostGQL, {
    name: 'createPost'
  }),
  graphql(updatePostGQL, {
    name: 'updatePost'
  })
)

export default enhance(ConfirmPost)
