import { Metric } from '../../dataHub/metrics'

export const NO_GROUP = '_'

export const AVAILABLE_TIMEBOUNDS = {
  dormant_circulation_: {
    base: Metric.dormant_circulation
  }
}

const addItemToGraph = (graph, node, item) => {
  const items = graph[node]

  if (items) {
    items.push(item)
  } else {
    graph[node] = [item]
  }
}

function sortCategoryGroups (category, Submetrics) {
  const sortedCategory = {
    [NO_GROUP]: []
  }

  const GroupSubmetricsLength = Object.keys(Submetrics).reduce((acc, key) => {
    acc[Metric[key].group] = Submetrics[key].length

    return acc
  }, Object.create(null))

  const groups = Object.keys(category).sort(
    (leftGroup, rightGroup) =>
      (category[leftGroup].length + GroupSubmetricsLength[leftGroup] || 0) -
      (category[rightGroup].length + GroupSubmetricsLength[rightGroup] || 0)
  )

  groups.forEach(group => (sortedCategory[group] = category[group]))
  return sortedCategory
}

export function getMetric (availableMetric) {
  const availableTimebounds = { ...AVAILABLE_TIMEBOUNDS }

  let metric =
    typeof availableMetric === 'object'
      ? availableMetric
      : Metric[availableMetric]

  if (!metric) {
    const availableTimeboundKey = Object.keys(availableTimebounds).find(key => {
      return availableMetric.indexOf(key) !== -1
    })

    if (availableTimeboundKey) {
      metric = availableTimebounds[availableTimeboundKey].base
      delete availableTimebounds[availableTimeboundKey]
    }
  }

  return metric
}

export const getCategoryGraph = (
  availableMetrics,
  hiddenMetrics = [],
  Submetrics = {},
  isBeta
) => {
  if (availableMetrics.length === 0) {
    return {}
  }

  const categories = {
    Financial: undefined,
    Social: undefined,
    Development: undefined,
    Derivatives: undefined
  }
  const { length } = availableMetrics

  for (let i = 0; i < length; i++) {
    const availableMetric = availableMetrics[i]

    const metric = getMetric(availableMetric)

    if (!metric) {
      continue
    }

    if (!hiddenMetrics.includes(metric)) {
      const { isBeta: isBetaMetric } = metric

      if (!isBetaMetric || isBeta) {
        addItemToGraph(categories, metric.category, {
          item: metric,
          subitems: Submetrics[metric.key] || []
        })
      }
    }
  }

  Object.keys(categories).forEach(key => {
    if (!categories[key]) {
      return delete categories[key]
    }

    const category = categories[key].reduce(
      (acc, value) => {
        const { group = NO_GROUP } = value.item
        addItemToGraph(acc, group, value)
        return acc
      },
      { [NO_GROUP]: [] }
    )

    categories[key] = sortCategoryGroups(category, Submetrics)
  })

  return categories
}

const LS_IS_SIDEBAR_LOCKED = 'LS_IS_SIDEBAR_LOCKED'
export function loadIsSidebarLocked () {
  const state = localStorage.getItem(LS_IS_SIDEBAR_LOCKED)
  return state === null || !!state
}
export const saveIsSidebarLocked = state =>
  localStorage.setItem(LS_IS_SIDEBAR_LOCKED, state ? '+' : '')
