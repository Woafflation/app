import React from 'react'
import gql from 'graphql-tag'
import { compose } from 'redux'
import { graphql } from 'react-apollo'
import Icon from '@santiment-network/ui/Icon'
import { SearchWithSuggestions } from '@santiment-network/ui/Search'
import { Checkbox } from '@santiment-network/ui/Checkboxes'
import { allProjectsForSearchGQL } from '../../pages/Projects/allProjectsGQL'
import { hasAssetById } from '../WatchlistPopup/WatchlistsPopup'
import ProjectIcon from './../ProjectIcon/ProjectIcon'
import styles from './SearchContainer.module.scss'
import ALL_PROJECTS from './../../allProjects.json'

const TRENDING_WORDS_QUERY = gql`
  query getTrendingWords($from: DateTime!, $to: DateTime!) {
    getTrendingWords(size: 10, from: $from, to: $to, interval: "1h") {
      datetime
      topWords {
        score
        word
      }
    }
  }
`

const assetsPredicate = searchTerm => {
  const upperCaseSearchTerm = searchTerm.toUpperCase()
  return ({ ticker, name, slug }) =>
    name.toUpperCase().includes(upperCaseSearchTerm) ||
    ticker.toUpperCase().includes(upperCaseSearchTerm) ||
    slug.toUpperCase().includes(upperCaseSearchTerm)
}

const trendWordsPredicate = searchTerm => {
  const upperCaseSearchTerm = searchTerm.toUpperCase()
  return word => word.toUpperCase().includes(upperCaseSearchTerm)
}

const AssetSuggestion = ({
  id,
  name,
  ticker,
  slug,
  isCopyingAssets,
  checkedAssets,
  isEditingWatchlist,
  isAssetInList
}) => (
  <div className={styles.projectWrapper}>
    <div className={styles.projectInfo}>
      {isCopyingAssets ? (
        <Checkbox
          isActive={checkedAssets.has(id)}
          className={styles.checkbox}
        />
      ) : (
        <ProjectIcon className={styles.icon} size={16} slug={slug} />
      )}
      <span className={styles.name}>{name}</span>
      <span className={styles.ticker}>({ticker})</span>
    </div>
    {isEditingWatchlist && (
      <Icon
        fill={`var(--${isAssetInList ? 'casper' : 'jungle-green'}`}
        type={isAssetInList ? 'remove' : 'plus-round'}
      />
    )}
  </div>
)

const SearchProjects = ({
  trendWords = [],
  projects = [],
  isEditingWatchlist,
  isCopyingAssets,
  checkedAssets,
  watchlistItems,
  ...props
}) => {
  return (
    <SearchWithSuggestions
      {...props}
      withMoreSuggestions={false}
      data={[
        {
          title: 'Assets',
          predicate: assetsPredicate,
          items: projects,
          suggestionContent: ({ name, ticker, slug, id }) => {
            const isAssetInList = isEditingWatchlist
              ? hasAssetById({ listItems: watchlistItems, id })
              : false
            return (
              <AssetSuggestion
                isAssetInList={isAssetInList}
                id={id}
                name={name}
                ticker={ticker}
                slug={slug}
                isEditingWatchlist={isEditingWatchlist}
                isCopyingAssets={isCopyingAssets}
                checkedAssets={checkedAssets}
              />
            )
          }
        },
        {
          title: 'Trending words',
          predicate: trendWordsPredicate,
          items: trendWords,
          suggestionContent: word => word
        }
      ]}
    />
  )
}

const enhance = compose(
  graphql(TRENDING_WORDS_QUERY, {
    skip: ({ noTrends }) => noTrends,
    options: () => {
      const from = new Date()
      const to = new Date()
      to.setHours(to.getHours(), 0, 0, 0)
      from.setHours(from.getHours() - 1, 0, 0, 0)

      return {
        variables: {
          from,
          to
        }
      }
    },
    props: ({ data: { getTrendingWords = [] } }) => {
      const trendWords = getTrendingWords[0]
      return {
        trendWords: trendWords
          ? trendWords.topWords.map(({ word }) => word)
          : []
      }
    }
  }),
  graphql(allProjectsForSearchGQL, {
    skip: ({ projects }) => projects && projects.length > 0,
    options: () => ({
      context: { isRetriable: true },
      variables: { minVolume: 0 }
    }),
    props: ({ data: { allProjects = [] } }) => {
      const projects = allProjects.length > 0 ? allProjects : ALL_PROJECTS

      return {
        projects: projects
          .slice()
          .sort(({ rank: a }, { rank: b }) => (a || Infinity) - (b || Infinity))
      }
    }
  })
)

export default enhance(SearchProjects)
