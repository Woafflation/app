import * as actions from './actions'

export const initialState = {
  isLoading: true,
  error: false,
  items: [],
  selected: null,
  scoreChange: {},
  allAssets: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.TRENDS_HYPED_FETCH:
      return initialState
    case actions.TRENDS_HYPED_FETCH_SUCCESS:
      return {
        ...state,
        ...action.payload
      }
    case actions.TRENDS_HYPED_FETCH_FAILED:
      return {
        isLoading: false,
        error: true,
        items: []
      }
    case actions.TRENDS_HYPED_FETCH_TICKERS_SLUGS_SUCCESS:
      return {
        ...state,
        ...action.payload
      }
    case actions.TRENDS_HYPED_FETCH_TICKERS_SLUGS_FAILED:
      return {
        allAssets: []
      }
    case actions.TRENDS_HYPED_WORD_SELECTED:
      return {
        ...state,
        selected: action.payload
      }
    case actions.TREND_WORD_SCORE_CHANGE_FULFILLED:
      return {
        ...state,
        scoreChange: action.payload
      }
    default:
      return state
  }
}
