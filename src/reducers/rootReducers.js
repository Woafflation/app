import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import user, { initialState as userState } from './user'
import projects, { initialState as projectsState } from './projects'
import timeseries, {
  initialState as timeseriesState
} from './../ducks/GetTimeSeries/reducers'
import signals, {
  initialState as signalsState
} from '../ducks/Signals/common/reducers'
import rootUi, { initialState as rootUiState } from './root-ui'
import notification, {
  initialState as initialNotificationState
} from './notification'
import watchlistUi, {
  initialState as initialWatchlistUiState
} from './watchlist-ui'
import hypedTrends, {
  initialState as initialHypedTrends
} from './../components/Trends/reducers'
import accountUi, {
  initialState as initialAccountUiState
} from '../pages/Account/reducers'
import marketSegments, {
  initialState as initialMarketSegments
} from '../pages/MarketSegments/reducers'
import app, {
  initialState as appUpdateState
} from './../ducks/Updates/reducers'

export const intitialState = {
  user: userState,
  projects: projectsState,
  hypedTrends: initialHypedTrends,
  timeseries: timeseriesState,
  signals: signalsState,
  watchlistUi: initialWatchlistUiState,
  rootUi: rootUiState,
  notification: initialNotificationState,
  router: routerReducer,
  accountUi: initialAccountUiState,
  marketSegments: initialMarketSegments,
  app: appUpdateState
}

export default combineReducers({
  user,
  projects,
  hypedTrends,
  timeseries,
  signals,
  rootUi,
  watchlistUi,
  notification,
  accountUi,
  marketSegments,
  app
})
