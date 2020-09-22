import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { ASSETS_BY_WALLET_QUERY } from '../../../ducks/HistoricalBalance/common/queries'

const TOP_CLAIMERS_QUERY = gql`
  query getMetric($from: DateTime!, $to: DateTime!) {
    getMetric(metric: "uniswap_top_claimers") {
      histogramData(
        selector: { slug: "uniswap" }
        from: $from
        to: $to
        limit: 50
      ) {
        values {
          ... on StringAddressFloatValueList {
            data {
              address
              value
              labels
            }
          }
        }
      }
    }
  }
`

export function useTopClaimers ({ from, to, slug }) {
  const { data = {}, loading } = useQuery(TOP_CLAIMERS_QUERY, {
    variables: { from, to }
  })

  if (
    data.getMetric &&
    data.getMetric.histogramData &&
    data.getMetric.histogramData.values
  ) {
    return [data.getMetric.histogramData.values.data || [], loading]
  }

  return [[], loading]
}

export function useAssetsBalance (address) {
  const { data: { assetsHeldByAddress } = {}, loading } = useQuery(
    ASSETS_BY_WALLET_QUERY,
    {
      skip: !address,
      variables: { address }
    }
  )

  return [assetsHeldByAddress, loading]
}
