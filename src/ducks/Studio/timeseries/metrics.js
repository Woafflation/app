import gql from 'graphql-tag'

const DEFAULT_SETTINGS = {}
const DEFAULT_SELECTOR = 'slug'

export const GET_METRIC = (
  { key, queryKey = key },
  { selector = DEFAULT_SELECTOR, queryKey: customKey } = DEFAULT_SETTINGS
) => gql`
  query getMetric(
    $from: DateTime!
    $to: DateTime!
    $slug: String,
    $slugs: [String],
    $interval: interval
    $transform: TimeseriesMetricTransformInputObject
    $holdersCount: Int
    $market_segments: [String]
    $ignored_slugs: [String]
    $source: String
    $owner: String,
    $label: String,
    $labels: [String],
  ) {
    getMetric(metric: "${customKey || queryKey}") {
      timeseriesData(selector: { ${selector}: $slug, slugs: $slugs, labels: $labels, holdersCount: $holdersCount, market_segments: $market_segments, ignored_slugs: $ignored_slugs, source: $source, owner: $owner, label: $label}, from: $from, to: $to, interval: $interval, transform: $transform) {
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
  'whale_transaction_count_100k_usd_to_inf',
  'whale_transaction_count_1m_usd_to_inf',
  'price_eth',
  'volume_usd',
  'marketcap_usd',
  'social_dominance_telegram',
  'social_dominance_reddit',
  'social_dominance_total',
  'social_volume_telegram',
  'social_volume_twitter',
  'social_volume_reddit',
  'social_volume_total',
  'community_messages_count_telegram',
  'community_messages_count_total',
  'realized_value_usd_180d',
  'mvrv_usd_2y',
  'circulation_90d',
  'transaction_volume',
  'mvrv_usd_7d',
  'daily_opening_price_usd',
  'mvrv_usd_5y',
  'circulation_60d',
  'realized_value_usd_1d',
  'circulation_3y',
  'daily_closing_marketcap_usd',
  'price_usd_change_7d',
  'mean_realized_price_usd_1d',
  'mvrv_long_short_diff_usd',
  'network_growth',
  'deposit_transactions',
  'mean_realized_price_usd_7d',
  'mean_realized_price_usd_365d',
  'daily_closing_price_usd',
  'realized_value_usd_90d',
  'mvrv_usd_90d',
  'mcd_erc20_supply',
  'realized_value_usd_30d',
  'exchange_balance',
  'mvrv_usd_3y',
  'circulation',
  'circulation_10y',
  'mvrv_usd',
  'mean_dollar_invested_age',
  'mean_realized_price_usd_60d',
  'nvt_transaction_volume',
  'exchange_inflow',
  'volume_usd_change_7d',
  'circulation_180d',
  'mean_realized_price_usd_5y',
  'active_deposits',
  'volume_usd_change_30d',
  'mvrv_usd_10y',
  'daily_high_price_usd',
  'exchange_outflow',
  'volume_usd_change_1d',
  'realized_value_usd_3y',
  'realized_value_usd_60d',
  'circulation_30d',
  'realized_value_usd_10y',
  'realized_value_usd_7d',
  'mvrv_usd_180d',
  'nvt',
  'daily_trading_volume_usd',
  'mean_realized_price_usd_10y',
  'active_addresses_24h_change_7d',
  'active_addresses_24h_change_1d',
  'price_usd_5m',
  'age_consumed',
  'circulation_2y',
  'realized_value_usd_5y',
  'price_usd_change_1d',
  'mean_realized_price_usd_90d',
  'circulation_365d',
  'percent_of_total_supply_on_exchanges',
  'mean_realized_price_usd_2y',
  'mean_age',
  'active_addresses_24h_change_30d',
  'daily_avg_price_usd',
  'daily_avg_marketcap_usd',
  'mvrv_usd_1d',
  'realized_value_usd_2y',
  'withdrawal_transactions',
  'mvrv_usd_30d',
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
  'active_withdrawals',
  'velocity',
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
  'mvrv_usd_365d',
  'mvrv_usd_intraday',
  'mvrv_usd_intraday_1d',
  'mvrv_usd_intraday_7d',
  'mvrv_usd_intraday_30d',
  'mvrv_usd_intraday_60d',
  'mvrv_usd_intraday_90d',
  'mvrv_usd_intraday_180d',
  'mvrv_usd_intraday_365d',
  'mvrv_usd_intraday_2y',
  'mvrv_usd_intraday_3y',
  'mvrv_usd_intraday_5y',
  'mvrv_usd_intraday_7y',
  'mvrv_usd_intraday_10y',
  'miners_balance',
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

  'holders_distribution_total',
  'holders_distribution_1M_to_10M',
  'holders_distribution_0.01_to_0.1',
  'holders_distribution_0_to_0.001',
  'holders_distribution_1_to_10',
  'holders_distribution_0.1_to_1',
  'holders_distribution_1k_to_10k',
  'holders_distribution_100_to_1k',
  'holders_distribution_10_to_100',
  'holders_distribution_10k_to_100k',
  'holders_distribution_0.001_to_0.01',
  'holders_distribution_100k_to_1M',
  'holders_distribution_10M_to_inf',

  'holders_distribution_combined_balance_100k_to_1M',
  'holders_distribution_combined_balance_0.01_to_0.1',
  'holders_distribution_combined_balance_0.1_to_1',
  'holders_distribution_combined_balance_1k_to_10k',
  'holders_distribution_combined_balance_10k_to_100k',
  'holders_distribution_combined_balance_10_to_100',
  'holders_distribution_combined_balance_1M_to_10M',
  'holders_distribution_combined_balance_1_to_10',
  'holders_distribution_combined_balance_100_to_1k',
  'holders_distribution_combined_balance_0_to_0.001',
  'holders_distribution_combined_balance_0.001_to_0.01',
  'holders_distribution_combined_balance_10M_to_inf',

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
  'percent_of_holders_distribution_combined_balance_10M_to_inf',

  'holders_labeled_distribution_0.001_to_0.01',
  'holders_labeled_distribution_0.01_to_0.1',
  'holders_labeled_distribution_0.1_to_1',
  'holders_labeled_distribution_0_to_0.001',
  'holders_labeled_distribution_100_to_1k',
  'holders_labeled_distribution_100k_to_1M',
  'holders_labeled_distribution_10_to_100',
  'holders_labeled_distribution_10k_to_100k',
  'holders_labeled_distribution_1M_to_10M',
  'holders_labeled_distribution_1_to_10',
  'holders_labeled_distribution_1k_to_10k',

  'holders_labeled_distribution_combined_balance_0.001_to_0.01',
  'holders_labeled_distribution_combined_balance_0.01_to_0.1',
  'holders_labeled_distribution_combined_balance_0.1_to_1',
  'holders_labeled_distribution_combined_balance_0_to_0.001',
  'holders_labeled_distribution_combined_balance_100_to_1k',
  'holders_labeled_distribution_combined_balance_100k_to_1M',
  'holders_labeled_distribution_combined_balance_10M_to_inf',
  'holders_labeled_distribution_combined_balance_10_to_100',
  'holders_labeled_distribution_combined_balance_10k_to_100k',
  'holders_labeled_distribution_combined_balance_1M_to_10M',
  'holders_labeled_distribution_combined_balance_1_to_10',
  'holders_labeled_distribution_combined_balance_1k_to_10k',
  'holders_labeled_distribution_combined_balance_total',
  'holders_labeled_distribution_total',

  'holders_labeled_negative_distribution_0.001_to_0.01',
  'holders_labeled_negative_distribution_0.01_to_0.1',
  'holders_labeled_negative_distribution_0.1_to_1',
  'holders_labeled_negative_distribution_0_to_0.001',
  'holders_labeled_negative_distribution_100_to_1k',
  'holders_labeled_negative_distribution_100k_to_1M',
  'holders_labeled_negative_distribution_10_to_100',
  'holders_labeled_negative_distribution_10k_to_100k',
  'holders_labeled_negative_distribution_1M_to_10M',
  'holders_labeled_negative_distribution_1_to_10',
  'holders_labeled_negative_distribution_1k_to_10k',

  'holders_labeled_negative_distribution_combined_balance_0.001_to_0.01',
  'holders_labeled_negative_distribution_combined_balance_0.01_to_0.1',
  'holders_labeled_negative_distribution_combined_balance_0.1_to_1',
  'holders_labeled_negative_distribution_combined_balance_0_to_0.001',
  'holders_labeled_negative_distribution_combined_balance_100_to_1k',
  'holders_labeled_negative_distribution_combined_balance_100k_to_1M',
  'holders_labeled_negative_distribution_combined_balance_10M_to_inf',
  'holders_labeled_negative_distribution_combined_balance_10_to_100',
  'holders_labeled_negative_distribution_combined_balance_10k_to_100k',
  'holders_labeled_negative_distribution_combined_balance_1M_to_10M',
  'holders_labeled_negative_distribution_combined_balance_1_to_10',
  'holders_labeled_negative_distribution_combined_balance_1k_to_10k',
  'holders_labeled_negative_distribution_combined_balance_total',
  'holders_labeled_negative_distribution_total',

  'social_active_users',
  'price_daa_divergence',
  'adjusted_price_daa_divergence',
  'active_addresses_24h',
  'active_addresses_1h',
  'uniswap_total_claims_amount',
  'uniswap_total_user_claims_amount',
  'uniswap_total_lp_claims_amount',
  'uniswap_total_claims_percent',
  'uniswap_total_claims_count',
  'uniswap_total_user_claims_count',
  'uniswap_total_lp_claims_count',
  'uniswap_claims_count',
  'uniswap_lp_claims_count',
  'uniswap_user_claims_count',
  'uniswap_claims_amount',
  'uniswap_lp_claims_amount',
  'uniswap_user_claims_amount',
  'uniswap_user_claims_count',

  'total_trade_amount_by_dex',
  'eth_based_trade_amount_by_dex',
  'stablecoin_trade_amount_by_dex',
  'other_trade_amount_by_dex',

  'total_trade_volume_by_dex',
  'eth_based_trade_volume_by_dex',
  'stablecoin_trade_volume_by_dex',
  'other_trade_volume_by_dex',

  'miners_balance',
  'genesis_balance',
  'dex_trader_balance',
  'defi_balance',
  'dex_balance',
  'cex_balance',
  'withdrawal_balance',
  'deposit_balance',
  'proxy_balance',
  'whale_balance',
  'makerdao_bite_keeper_balance',
  'makerdao_cdp_owner_balance',
  'unlabeled_balance',
  'all_known_balance',

  'total_supply',
  'network_profit_loss',
  'average_fees_usd',
  'median_fees_usd',
  'active_deposits_5m',
  'deposit_transactions_5m',

  'balance_per_owner',
  'eth2_stakers_count',
  'labelled_exchange_balance_sum',

  'eth_trade_volume_by_token',
  'stablecoin_trade_volume_by_token',
  'token_eth_price_by_dex_5m',
  'exchange_balance_per_exchange',
  'mvrv_usd_z_score',

  'mcd_locked_token',
  'scd_locked_token',
  'mcd_supply',
  'mcd_collat_ratio',
  'mcd_collat_ratio_weth',
  'mcd_collat_ratio_sai',
  'scd_collat_ratio',
  'mcd_dsr',
  'mcd_stability_fee',
  'dai_created',
  'dai_repaid',
  'mcd_liquidation'
]
