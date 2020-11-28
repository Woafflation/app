// app
export const SHOW_NOTIFICATION = '[app] SHOW_NOTIFICATION'
export const HIDE_NOTIFICATION = '[app] HIDE_NOTIFICATION'
export const APP_CHANGE_ONLINE_STATUS = '[app] CHANGE_ONLINE_STATUS'
export const APP_LAUNCHED = '[app] LAUNCHED'
export const APP_SHOW_ONBOARDING = '[app] SHOW_ONBOARDING'
export const APP_GDPR_FAILED = '[app] GDPR_FAILED'
export const APP_USER_HAS_INACTIVE_TOKEN = '[app] USER_HAS_INACTIVE_TOKEN'
export const APP_USER_NIGHT_MODE_SAVE = '[app] USER_NIGHT_MODE_SAVE'
export const APP_USER_WIDE_CHART_MODE_SAVE = '[app] USER_WIDE_CHART_MODE_SAVE'
export const APP_USER_NIGHT_MODE_SAVE_FAILED =
  '[app] USER_NIGHT_MODE_SAVE_FAILED'
export const APP_USER_BETA_MODE_SAVE = '[app] USER_BETA_MODE_SAVE'
export const APP_USER_BETA_MODE_SAVE_FAILED = '[app] USER_BETA_MODE_SAVE_FAILED'
export const APP_TOGGLE_SEARCH_FOCUS = '[app] TOGGLE_SEARCH_FOCUS'

// user
export const CHANGE_USER_DATA = '[user] CHANGE_USER_DATA'
export const USER_LOGIN_FAILED = '[user] LOGIN_FAILED'
export const USER_LOGIN_SUCCESS = '[user] LOGIN_SUCCESS'
export const USER_LOGIN_PENDING = '[user] LOGIN_PENDING'
export const USER_EMAIL_LOGIN = '[user] EMAIL_LOGIN'
export const USER_EMAIL_CHANGE = '[user] EMAIL_CHANGE'
export const USER_SUBSCRIPTION_CHANGE = '[user] SUBSCRIPTION_CHANGE'
export const USER_DIGEST_CHANGE = '[user] DIGEST_CHANGE'
export const USER_USERNAME_CHANGE = '[user] USERNAME_CHANGE'
export const USER_AVATAR_CHANGE = '[user] AVATAR_CHANGE'
export const USER_APIKEY_GENERATE = '[user] APIKEY_GENERATE'
export const USER_APIKEY_GENERATE_SUCCESS = '[user] APIKEY_GENERATE_SUCCESS'
export const USER_APIKEY_REVOKE = '[user] APIKEY_REVOKE'
export const USER_APIKEY_REVOKE_SUCCESS = '[user] APIKEY_REVOKE_SUCCESS'
export const USER_ETH_LOGIN = '[user] ETH_LOGIN'
export const USER_LOGOUT = '[user] LOGOUT'
export const USER_LOGOUT_SUCCESS = '[user] LOGOUT_SUCCESS'
export const USER_LOGOUT_ERROR = '[user] LOGOUT_ERROR'
export const USER_TOGGLE_PRIVACY_POLICY = '[user] TOGGLE_PRIVACY_POLICY'
export const USER_TOGGLE_MARKETING = '[user] TOGGLE_MARKETING'
export const USER_SETTING_GDPR = '[user] SETTING_SETTING_GDPR'
export const USER_TOGGLE_NIGHT_MODE = '[user] TOGGLE_NIGHT_MODE'
export const USER_TOGGLE_WIDE_CHART = '[user] TOGGLE_WIDE_CHART'
export const USER_TOGGLE_BETA_MODE = '[user] TOGGLE_BETA_MODE'
// user / settings
export const SETTINGS_REMOVE_CONNECTED_WALLET = '[user] REMOVE_CONNECTED_WALLET'
export const SETTINGS_REMOVE_CONNECTED_WALLET_SUCCESS =
  '[user] REMOVE_CONNECTED_WALLET_SUCCESS'
export const SETTINGS_REMOVE_CONNECTED_WALLET_FAILED =
  '[user] REMOVE_CONNECTED_WALLET_FAILED'
export const SETTINGS_CONNECT_NEW_WALLET = '[user] CONNECT NEW WALLET'
export const SETTINGS_CONNECT_NEW_WALLET_SUCCESS =
  '[user] CONNECT NEW WALLET SUCCESS'
export const SETTINGS_CONNECT_NEW_WALLET_FAILED =
  '[user] CONNECT NEW WALLET FAILED'
export const SETTINGS_GENERATE_TELEGRAM_DEEP_LINK =
  '[user] GENERATE_TELEGRAM_DEEP_LINK'
export const SETTINGS_REVOKE_TELEGRAM_DEEP_LINK =
  '[user] REVOKE_TELEGRAM_DEEP_LINK'
export const SETTINGS_REVOKE_TELEGRAM_DEEP_LINK_SUCCESS =
  '[user] SETTINGS_REVOKE_TELEGRAM_DEEP_LINK_SUCCESS'
export const SETTINGS_GENERATE_TELEGRAM_DEEP_LINK_SUCCESS =
  '[user] GENERATE_TELEGRAM_DEEP_LINK_SUCCESS'
export const SETTINGS_GENERATE_TELEGRAM_DEEP_LINK_FAILED =
  '[user] GENERATE_TELEGRAM_DEEP_LINK_FAILED'
export const SETTINGS_CONNECT_TELEGRAM = '[user] CONNECT_TELEGRAM'
export const SETTINGS_CONNECT_TELEGRAM_SUCCESS =
  '[user] CONNECT_TELEGRAM_SUCCESS'
export const SETTINGS_CONNECT_TELEGRAM_FAILED = '[user] CONNECT_TELEGRAM_FAILED'
export const SETTINGS_CONNECT_TELEGRAM_CANCEL = '[user] CONNECT_TELEGRAM_CANCEL'

// assets
export const USER_ADD_NEW_ASSET_LIST = '[user] ADD_NEW_ASSET_LIST'
export const USER_ADD_NEW_ASSET_LIST_SUCCESS =
  '[user] ADD_NEW_ASSET_LIST_SUCCESS'
export const USER_ADD_NEW_ASSET_LIST_FAILED = '[user] ADD_NEW_ASSET_LIST_FAILED'
export const USER_ADD_NEW_ASSET_LIST_CANCEL =
  '[user] ADD_NEW_ASSET_LIST_CANCELED'
export const USER_REMOVE_ASSET_LIST = '[user] REMOVE_ASSET_LIST'
export const USER_REMOVE_ASSET_LIST_SUCCESS = '[user] REMOVE_ASSET_LIST_SUCCESS'
export const USER_REMOVE_ASSET_LIST_FAILED = '[user] REMOVE_ASSET_LIST_FAILED'
export const USER_ADD_ASSET_TO_LIST = '[user] ADD_ASSET_TO_LIST'
export const USER_ADD_ASSET_TO_LIST_SUCCESS =
  '[user] USER_ADD_ASSET_TO_LIST_SUCCESS'
export const USER_ADD_ASSET_TO_LIST_FAILED =
  '[user] USER_ADD_ASSET_TO_LIST_FAILED'
export const USER_REMOVE_ASSET_FROM_LIST = '[user] REMOVE_ASSET_FROM_LIST'
export const USER_REMOVED_ASSET_FROM_LIST_SUCCESS =
  '[user] REMOVED_ASSET_FROM_LIST'
export const USER_REMOVED_ASSET_FROM_LIST_FAILED =
  '[user] REMOVED_ASSET_FROM_LIST'
export const USER_EDIT_ASSETS_IN_LIST = '[assets] EDIT_ASSETS_IN_LIST'
export const USER_EDIT_ASSETS_IN_LIST_SUCCESS =
  '[assets] EDIT_ASSETS_IN_LIST_SUCCESS'
export const USER_EDIT_ASSETS_IN_LIST_FAILED =
  '[assets] EDIT_ASSETS_IN_LIST_FAILED'
export const ASSETS_FETCH = '[assets] ASSETS_FETCH'
export const ASSETS_FETCH_SUCCESS = '[assets] ASSETS_FETCH_SUCCESS'
export const ASSETS_FETCH_FAILED = '[assets] ASSETS_FETCH_FAILED'

// WATCHLIST(-S) SETTINGS
export const WATCHLIST_TOGGLE_MONITORING = '[watchlist] TOGGLE_MONITORING'
export const WATCHLIST_TOGGLE_MONITORING_SUCCESS =
  '[watchlist] TOGGLE_MONITORING_SUCCESS'
export const WATCHLIST_TOGGLE_MONITORING_FAILED =
  '[watchlist] TOGGLE_MONITORING_FAILED'
export const WATCHLIST_TOGGLE_COLUMNS = '[watchlist] TOGGLE_COLUMNS'
export const WATCHLIST_SETTINGS_SAVE_SUCCESS =
  '[watchlist] SETTINGS_SAVE_SUCCESS'
export const WATCHLIST_SETTINGS_SAVE_FAILED = '[watchlist] SETTINGS_SAVE_FAILED'
export const WATCHLISTS_SETTINGS_FETCH = '[watchlists] SETTINGS_FETCH'
export const WATCHLISTS_SETTINGS_FETCH_SUCCESS =
  '[watchlists] SETTINGS_FETCH_SUCCESS'
export const WATCHLISTS_SETTINGS_FETCH_FAILED =
  '[watchlists] SETTINGS_FETCH_FAILED'
