import { Observable } from 'rxjs'
import { PROJECTS_QUERY, DEV_ACT_QUERY } from './queries'
import { handleErrorAndTriggerAction } from '../../epics/utils'
import { getTimeIntervalFromToday, DAY, MONTH } from '../../utils/dates'
import { client as apollo } from '../../index'
import * as actions from './actions'
import devActChange30d from './devActChange.json'

const getFunction = segment =>
  `{"name": "market_segments", "args":{"market_segments": [ "${segment}" ]}}`

const { from, to } = getTimeIntervalFromToday(-30, DAY)
const FROM = from.toISOString()
const TO = to.toISOString()
const devActChange = {}
const chunkSize = 30

const escapeSlugToNormal = slug => slug.slice(1).replace(/_cs_/g, '-')
const calculateDevAct = ({ data }) => {
  Object.keys(data).forEach(key => {
    const res = data[key]
    if (res.length === 0) {
      devActChange[escapeSlugToNormal(key)] = 0
      return
    }
    if (res.length !== 2) {
      /* console.log(
        new Error('Not 2 items in array'),
        res,
        key,
        escapeSlugToNormal(key),
      ) */
      devActChange[escapeSlugToNormal(key)] = 0
      return
    }
    const [{ activity: past }, { activity: now }] = res

    if (past === 0) {
      devActChange[escapeSlugToNormal(key)] = 100
      return
    }

    devActChange[escapeSlugToNormal(key)] = ((now - past) / past) * 100
  })
}

const Fn = {
  Ethereum: getFunction('Ethereum'),
  DeFi: getFunction('DeFi'),
  EOS: getFunction('EOS')
}

export const fetchMarketSegments = (action$, store, { client }) =>
  action$
    .ofType(actions.MARKET_SEGMENTS_FETCH)
    .switchMap(({ payload: { segment, forced = false } }) => {
      const fetchPolicy = forced ? 'network-only' : 'cache-first'

      return Observable.forkJoin([
        Promise.resolve(forced),
        client.query({
          query: PROJECTS_QUERY,
          variables: { fn: Fn[segment] },
          fetchPolicy
        })
      ])
    })
    .mergeMap(([forced, { data: { assets } }]) => {
      const payload = {
        assets: assets.map(asset => {
          return {
            ...asset,
            devActChange30d: devActChange30d[asset.slug]
          }
        })
      }
      if (forced) {
        payload.timestamp = Date.now()
      }

      /*
      let i = 0
      const interval = setInterval(() => {
        const start = chunkSize * i
        const end = start + chunkSize
        i = i + 1
        const slice = assets.slice(start, end)
        if (slice.length === 0) {
          return clearInterval(interval)
        }
        const slugs = slice.map(({ slug }) => slug)
        apollo
          .query({
            query: DEV_ACT_QUERY(slugs, FROM, TO),
          })
          .then(calculateDevAct)
      }, 2000)
      */

      return Observable.of({
        type: actions.MARKET_SEGMENTS_FETCH_SUCCESS,
        payload
      })
    })
    .catch(handleErrorAndTriggerAction(actions.MARKET_SEGMENTS_FETCH_FAIL))
