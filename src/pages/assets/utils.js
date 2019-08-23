import qs from 'query-string'
import { WATCHLISTS_BY_SLUG } from './assets-overview-constants'

const getListName = name => {
  const isPublic = WATCHLISTS_BY_SLUG.find(
    ({ assetType }) => assetType === name
  )
  return isPublic ? isPublic.name : name
}

export const getTableTitle = ({ type, location: { search } }) => {
  switch (type) {
    case 'all':
      return 'All Assets'
    case 'currencies':
      return 'Currencies'
    case 'erc20':
      return 'ERC20 Assets'
    case 'list':
      const name = (qs.parse(search).name || '').split('@')[0]
      return getListName(name)
    default:
      return 'Assets'
  }
}

export const normalizeCSV = items => {
  return items.map(item => {
    const {
      coinmarketcapId,
      __typename,
      id,
      signals,
      ethAddresses,
      ...rest
    } = item
    const _ethAddresses = ethAddresses
      ? ethAddresses.map(
        address =>
          `https://app.santiment.net/balance?address=${
            address.address
          }&assets[]=ethereum`
      )
      : undefined
    if (_ethAddresses && _ethAddresses.length > 0) {
      return { _ethAddresses, ...rest }
    }
    return rest
  })
}

export const getHelmetTags = (isList, listName) => {
  return {
    title: isList
      ? `Crypto Watchlist: ${getListName(listName.split('@')[0])} - SANbase`
      : 'All Crypto Assets - SANbase',
    description: isList
      ? 'Santiment Watchlists let you keep track of different crypto projects, and compare their performance, on-chain behavior and development activity.'
      : 'Financial, on-chain and development data for 1100+ crypto projects in the Santiment database, including BTC, XRP, ETH and 700+ ERC-20 tokens'
  }
}
