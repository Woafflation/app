import { getWatchlistsShortQuery } from './lists/helpers'

function watchlistsCacheUpdater (visitor) {
  return (cache, { data }) => {
    const { type } = data.watchlist
    const query = getWatchlistsShortQuery(type)
    const { watchlists } = cache.readQuery({ query: query })

    cache.writeQuery({
      query: query,
      data: { watchlists: visitor(data, watchlists) }
    })
  }
}
