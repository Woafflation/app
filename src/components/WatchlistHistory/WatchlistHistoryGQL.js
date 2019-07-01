import gql from 'graphql-tag'

export const CATEGORY_HISTORY_QUERY = gql`
  query historyPrice(
    $from: DateTime!
    $to: DateTime!
    $slug: String
    $interval: String = "1d"
  ) {
    historyPrice(from: $from, to: $to, slug: $slug, interval: $interval) {
      marketcap
      volume
      datetime
    }
  }
`

export const PROJECTS_HISTORY_QUERY = gql`
  query projectsListHistoryStats(
    $from: DateTime!
    $to: DateTime!
    $slugs: [String]!
    $interval: String = "1d"
  ) {
    projectsListHistoryStats(
      from: $from
      to: $to
      slugs: $slugs
      interval: $interval
    ) {
      marketcap
      volume
      datetime
    }
  }
`

export const WATCHLIST_HISTORY_QUERY = gql`
  query watchlist(
    $id: Int!
    $from: DateTime!
    $to: DateTime!
    $interval: String = "1d"
  ) {
    watchlist(id: $id) {
      name
      historicalStats(from: $from, to: $to, interval: $interval) {
        datetime
        marketcap
        volume
      }
    }
  }
`
