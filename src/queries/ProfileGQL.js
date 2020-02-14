import gql from 'graphql-tag'
import { INSIGHT_COMMON_FRAGMENT } from './InsightsGQL'
import { TRIGGERS_COMMON_FRAGMENT } from '../ducks/Signals/common/queries'
import {
  WATCHLIST_GENERAL_FRAGMENT,
  PROJECT_ITEM_FRAGMENT
} from './WatchlistGQL'

export const PUBLIC_USER_DATA_QUERY = gql`
  query getUser($userId: ID, $username: String) {
    getUser(selector: { id: $userId, username: $username }) {
      id
      email
      username
      avatarUrl
      watchlists {
        ...generalListData
        ...listShortItems
      }
      followers {
        count
        users {
          id
          avatarUrl
          username
        }
      }
      following {
        count
        users {
          id
          avatarUrl
          username
        }
      }
      insights {
        ...insightCommon
      }
      triggers {
        ...triggersCommon
      }
    }
  }
  ${INSIGHT_COMMON_FRAGMENT}
  ${TRIGGERS_COMMON_FRAGMENT}
  ${WATCHLIST_GENERAL_FRAGMENT}
  ${PROJECT_ITEM_FRAGMENT}
`

export const FOLLOW_MUTATION = gql(`
  mutation follow($id: ID!)
  {
    follow(userId: $id) {
        id
    }
  }
`)

export const UNFOLLOW_MUTATION = gql(`
  mutation unfollow($id: ID!) {
    unfollow(userId: $id) {
        id
    }
  }
`)
