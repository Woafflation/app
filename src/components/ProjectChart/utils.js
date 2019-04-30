import outliers from 'outliers'
import { getIntervalByTimeRange } from '../../utils/dates'

export const makeItervalBounds = (interval = '1m') => {
  const { from, to } = getIntervalByTimeRange(interval)
  const result = {
    from: from.toISOString(),
    to: to.toISOString()
  }

  switch (interval) {
    case '1d':
      result.minInterval = '5m'
      break

    case '1w':
      result.minInterval = '1h'
      break

    case '2w':
      result.minInterval = '1h'
      break

    case '3m':
      result.minInterval = '1d'
      break

    case 'all':
      result.minInterval = '1d'
      break

    default:
      result.minInterval = '1h'
  }

  return result
}

export const normalizeData = ({ data = [], fieldName, filter = 'all' }) => {
  if (data.length === 0) {
    return []
  }
  const normalizedData = data.map(el => {
    const normalizedField = parseFloat(el[`${fieldName}`])
    return {
      ...el,
      [fieldName]: normalizedField
    }
  })
  // https://github.com/matthewmueller/outliers/blob/9d9725ce75b55018a0b25f93d92538d7ff24b36c/index.js#L26
  // We use that lib, which helps find outliers. But if we want find rest we
  // need to do not very readable one liner.
  if (filter === 'only') {
    return normalizedData.filter(
      (val, i, arr) => !outliers(`${fieldName}`)(val, i, arr)
    )
  }
  if (filter === 'rest') {
    return normalizedData.filter(outliers(`${fieldName}`))
  }
  return normalizedData
}
