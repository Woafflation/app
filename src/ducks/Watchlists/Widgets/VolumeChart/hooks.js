import { useEffect, useMemo, useState } from 'react'
import {
  useProjectPriceChanges,
  useProjectsSocialVolumeChanges
} from '../../../../hooks/project'
import { getPriceSorter, mapToColors } from './utils'

export const useWithColors = (data, key, sorter) => {
  const [result, setResult] = useState([])

  useEffect(
    () => {
      const sorted = data.sort(sorter)
      setResult(mapToColors(sorted, key))
    },
    [data.length, key, sorter]
  )

  return result
}

export const useProjectRanges = ({
  assets,
  ranges,
  limit,
  sortByKey: inputKey,
  desc = true,
  isSocialVolume = false,
  settings,
  onChangeInterval
}) => {
  const defaultSelectedIndex =
    settings && settings.interval
      ? ranges.findIndex(({ label }) => label === settings.interval)
      : 1

  const [intervalIndex, setIntervalIndex] = useState(() =>
    Math.min(ranges.length - 1, defaultSelectedIndex)
  )

  useEffect(
    () => {
      onChangeInterval(ranges[intervalIndex])
    },
    [intervalIndex]
  )

  const { label, key } = ranges[intervalIndex]

  const sortKey = inputKey || key
  const sorter = getPriceSorter({ sortKey, desc })

  const hookProps = useMemo(
    () => {
      return {
        assets: assets.map(({ slug }) => slug),
        key,
        limit,
        sorter
      }
    },
    [assets, key, limit, sorter]
  )

  const [data, loading] = isSocialVolume
    ? useProjectsSocialVolumeChanges({ ...hookProps, interval: label })
    : useProjectPriceChanges(hookProps)

  return { data, loading, intervalIndex, setIntervalIndex, label, key }
}
