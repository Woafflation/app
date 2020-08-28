import gql from 'graphql-tag'

const DEFAULT_SETTINGS = {}
const DEFAULT_SELECTOR = 'slug'

export const GET_METRIC = (
  { key, queryKey = key },
  { selector = DEFAULT_SELECTOR } = DEFAULT_SETTINGS
) => gql`
  query getMetric(
    $from: DateTime!
    $to: DateTime!
    $slug: String
    $interval: interval
    $transform: TimeseriesMetricTransformInputObject
    $holdersCount: Int
    $market_segments: [String]
    $ignored_slugs: [String]
  ) {
    getMetric(metric: "${queryKey}") {
      timeseriesData(selector: { ${selector}: $slug, holdersCount: $holdersCount, market_segments: $market_segments, ignored_slugs: $ignored_slugs}, from: $from, to: $to, interval: $interval, transform: $transform) {
        datetime
        ${key}: value
      }
    }
  }
`

// Available metrics could be fetched via "getAvailableMetrics" query
export const METRICS = [
  'age_distribution',
  'price_histogram',
  'amount_in_top_holders',
  'amount_in_exchange_top_holders',
  'amount_in_non_exchange_top_holders',
  'twitter_followers',
  'price_usd',
  'price_btc',
  'price_eth',
  'volume_usd',
  'marketcap_usd',
  'social_dominance_telegram',
  'social_dominance_discord',
  'social_dominance_reddit',
  'social_dominance_professional_traders_chat',
  'social_dominance_total',
  'social_volume_telegram',
  'social_volume_twitter',
  'social_volume_discord',
  'social_volume_reddit',
  'social_volume_professional_traders_chat',
  'social_volume_total',
  'community_messages_count_telegram',
  'community_messages_count_total',
  'realized_value_usd_180d',
  'mvrv_usd_2y',
  'circulation_90d',
  'transaction_volume',
  'mvrv_usd_7d',
  'mcd_supply',
  'daily_opening_price_usd',
  'mvrv_usd_5y',
  'circulation_60d',
  'holders_distribution_combined_balance_100k_to_1M',
  'realized_value_usd_1d',
  'holders_distribution_0.1_to_1',
  'circulation_3y',
  'holders_distribution_0_to_0.001',
  'daily_closing_marketcap_usd',
  'holders_distribution_1_to_10',
  'price_usd_change_7d',
  'mean_realized_price_usd_1d',
  'mvrv_usd_365d',
  'mvrv_long_short_diff_usd',
  'network_growth',
  'deposit_transactions',
  'mean_realized_price_usd_7d',
  'holders_distribution_1k_to_10k',
  'dai_repaid',
  'mean_realized_price_usd_365d',
  'scd_collat_ratio',
  'daily_closing_price_usd',
  'realized_value_usd_90d',
  'mvrv_usd_90d',
  'mcd_erc20_supply',
  'mcd_stability_fee',
  'holders_distribution_combined_balance_0.01_to_0.1',
  'holders_distribution_combined_balance_0.1_to_1',
  'active_addresses_24h',
  'realized_value_usd_30d',
  'exchange_balance',
  'mvrv_usd_3y',
  'circulation',
  'circulation_10y',
  'holders_distribution_combined_balance_1k_to_10k',
  'dai_created',
  'mvrv_usd',
  'holders_distribution_100_to_1k',
  'mean_dollar_invested_age',
  'holders_distribution_combined_balance_10k_to_100k',
  'mean_realized_price_usd_60d',
  'nvt_transaction_volume',
  'exchange_inflow',
  'volume_usd_change_7d',
  'circulation_180d',
  'mean_realized_price_usd_5y',
  'active_deposits',
  'holders_distribution_10_to_100',
  'volume_usd_change_30d',
  'mvrv_usd_10y',
  'daily_high_price_usd',
  'exchange_outflow',
  'volume_usd_change_1d',
  'realized_value_usd_3y',
  'realized_value_usd_60d',
  'holders_distribution_10k_to_100k',
  'mcd_collat_ratio_weth',
  'mcd_locked_token',
  'circulation_30d',
  'realized_value_usd_10y',
  'realized_value_usd_7d',
  'holders_distribution_total',
  'holders_distribution_combined_balance_1M_to_10M',
  'mvrv_usd_180d',
  'holders_distribution_combined_balance_10_to_100',
  'nvt',
  'daily_trading_volume_usd',
  'mean_realized_price_usd_10y',
  'mcd_collat_ratio_sai',
  'mcd_collat_ratio',
  'holders_distribution_1M_to_10M',
  'holders_distribution_0.01_to_0.1',
  'active_addresses_24h_change_7d',
  'active_addresses_24h_change_1d',
  'price_usd_5m',
  'scd_locked_token',
  'age_consumed',
  'circulation_2y',
  'realized_value_usd_5y',
  'price_usd_change_1d',
  'mean_realized_price_usd_90d',
  'circulation_365d',
  'holders_distribution_0.001_to_0.01',
  'percent_of_total_supply_on_exchanges',
  'mean_realized_price_usd_2y',
  'mean_age',
  'active_addresses_24h_change_30d',
  'daily_avg_price_usd',
  'mcd_dsr',
  'daily_avg_marketcap_usd',
  'mvrv_usd_1d',
  'realized_value_usd_2y',
  'holders_distribution_combined_balance_1_to_10',
  'withdrawal_transactions',
  'holders_distribution_combined_balance_100_to_1k',
  'mvrv_usd_30d',
  'holders_distribution_combined_balance_0_to_0.001',
  'realized_value_usd',
  'mean_realized_price_usd',
  'daily_low_price_usd',
  'mean_realized_price_usd_3y',
  'price_usd_change_30d',
  'mvrv_usd_60d',
  'supply_outside_exchanges',
  'mean_realized_price_usd_180d',
  'supply_on_exchanges',
  'daily_active_addresses',
  'holders_distribution_combined_balance_0.001_to_0.01',
  'active_withdrawals',
  'velocity',
  'holders_distribution_combined_balance_10M_to_inf',
  'holders_distribution_100k_to_1M',
  'holders_distribution_10M_to_inf',
  'circulation_1d',
  'realized_value_usd_365d',
  'circulation_7d',
  'circulation_5y',
  'mean_realized_price_usd_30d',
  'dev_activity',
  'dev_activity_contributors_count',
  'github_activity',
  'github_activity_contributors_count',
  'sentiment_positive_total',
  'sentiment_positive_telegram',
  'sentiment_positive_reddit',
  'sentiment_positive_twitter',
  'sentiment_negative_total',
  'sentiment_negative_telegram',
  'sentiment_negative_reddit',
  'sentiment_negative_twitter',
  'sentiment_balance_total',
  'sentiment_balance_telegram',
  'sentiment_balance_reddit',
  'sentiment_balance_twitter',
  'sentiment_volume_consumed_total',
  'sentiment_volume_consumed_telegram',
  'sentiment_volume_consumed_reddit',
  'sentiment_volume_consumed_twitter',
  'bitmex_perpetual_basis',
  'bitmex_perpetual_open_interest',
  'bitmex_perpetual_funding_rate',
  'bitmex_perpetual_open_value',
  'mvrv_usd_intraday',
  'minersBalance',
  'dormant_circulation_180d',
  'dormant_circulation_2y',
  'dormant_circulation_365d',
  'dormant_circulation_3y',
  'dormant_circulation_5y',
  'dormant_circulation_90d',
  'stock_to_flow',
  'bitmex_perpetual_basis_ratio',
  'balance',
  'defi_total_value_locked_usd',
  'transaction_volume_usd',
  'percent_of_holders_distribution_combined_balance_0_to_0.001',
  'percent_of_holders_distribution_combined_balance_0.001_to_0.01',
  'percent_of_holders_distribution_combined_balance_0.01_to_0.1',
  'percent_of_holders_distribution_combined_balance_0.1_to_1',
  'percent_of_holders_distribution_combined_balance_1_to_10',
  'percent_of_holders_distribution_combined_balance_10_to_100',
  'percent_of_holders_distribution_combined_balance_100_to_1k',
  'percent_of_holders_distribution_combined_balance_1k_to_10k',
  'percent_of_holders_distribution_combined_balance_10k_to_100k',
  'percent_of_holders_distribution_combined_balance_100k_to_1M',
  'percent_of_holders_distribution_combined_balance_1M_to_10M',
  'percent_of_holders_distribution_combined_balance_10M_to_inf'
]
