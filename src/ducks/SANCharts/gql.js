import gql from 'graphql-tag'

export const PROJECT_METRICS_BY_SLUG_QUERY = gql`
  query projectBySlug($slug: String!) {
    project: projectBySlug(slug: $slug) {
      id
      availableMetrics
      availableQueries
      marketSegments
    }
  }
`

export const PROJECT_BY_SLUG_QUERY = gql`
  query projectBySlug($slug: String!) {
    project: projectBySlug(slug: $slug) {
      id
      ticker
      name
      description
      priceUsd
      percentChange24h
      percentChange7d
      totalSupply
    }
  }
`

export const PROJECT_BY_SLUG_MOBILE_QUERY = gql`
  query projectBySlug($slug: String!) {
    project: projectBySlug(slug: $slug) {
      id
      ticker
      name
      priceUsd
      percentChange24h
      percentChange7d
      devActivity30: averageDevActivity
      devActivity60: averageDevActivity(days: 60)
      icoPrice
    }
  }
`

export const HISTOGRAM_DATA_QUERY = gql`
  query getMetric(
    $slug: String!
    $from: DateTime!
    $to: DateTime!
    $interval: Int
  ) {
    getMetric(metric: "age_distribution") {
      histogramData(
        slug: $slug
        from: $from
        to: $to
        limit: 10
        interval: $interval
      ) {
        labels
        values {
          ... on FloatList {
            data
          }
        }
      }
    }
  }
`

export const MIN_MAX_PRICE_QUERY = gql`
  query getMinMaxPrice($slug: String!, $from: DateTime!, $to: DateTime!) {
    getMetric(metric: "price_usd") {
      min: aggregatedTimeseriesData(
        slug: $slug
        from: $from
        to: $to
        aggregation: MIN
      )
      max: aggregatedTimeseriesData(
        slug: $slug
        from: $from
        to: $to
        aggregation: MAX
      )
    }
  }
`
