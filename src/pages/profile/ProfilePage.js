import React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'
import cx from 'classnames'
import PublicWatchlists from './watchlists/PublicWatchlists'
import PublicSignals from './signals/PublicSignals'
import PublicInsights from './insights/PublicInsights'
import ProfileInfo from './info/ProfileInfo'
import MobileHeader from '../../components/MobileHeader/MobileHeader'
import PageLoader from '../../components/Loader/PageLoader'
import { PUBLIC_USER_DATA_QUERY } from '../../queries/ProfileGQL'
import { MobileOnly } from '../../components/Responsive'
import { mapQSToState } from '../../utils/utils'
import styles from './ProfilePage.module.scss'

const getQueryVariables = ({
  location,
  match: { params: { id } = {} } = {}
}) => {
  let variables
  if (id) {
    variables = { userId: id }
  } else {
    const { username } = mapQSToState({ location })
    variables = {
      username
    }
  }
  return variables
}

const ProfilePage = props => {
  const { currentUser, profile, isLoading, isUserLoading } = props

  if (isUserLoading || isLoading) {
    return <PageLoader />
  }

  if (!profile) {
    return (
      <div className={cx('page', styles.page)}>
        <NoProfileData />
      </div>
    )
  }

  const { id: profileId, insights, triggers, watchlists } = profile

  function updateCache (cache, { data: { follow, unfollow } }) {
    const queryVariables = getQueryVariables(props)

    const getUserData = cloneDeep(
      cache.readQuery({
        query: PUBLIC_USER_DATA_QUERY,
        variables: queryVariables
      })
    )

    const {
      getUser: { followers }
    } = getUserData
    const isInFollowers = followers.users.some(
      ({ id }) => +id === +currentUser.id
    )
    const { users } = followers

    if (isInFollowers) {
      const { id: followerId } = follow || unfollow
      followers.users = users.filter(({ id }) => +id !== +followerId)
    } else {
      users.push(follow)
      followers.users = [...users]
    }
    followers.count = followers.users.length

    cache.writeQuery({
      query: PUBLIC_USER_DATA_QUERY,
      variables: queryVariables,
      data: {
        ...getUserData
      }
    })
  }

  return (
    <>
      <div className={styles.info}>
        <MobileOnly>
          <div className={styles.header}>
            <MobileHeader title='Profile' />
          </div>
        </MobileOnly>
        <div className={cx('page', styles.page, styles.innerPage)}>
          <ProfileInfo profile={profile} updateCache={updateCache} />
        </div>
      </div>

      <div className={cx('page', styles.page)}>
        <div className={styles.row}>
          <PublicSignals userId={profileId} data={triggers} />
        </div>

        <div className={styles.row}>
          <div className={styles.colInsights}>
            <PublicInsights userId={profileId} data={insights} />
          </div>
          <div className={styles.colWatchlists}>
            <PublicWatchlists userId={profileId} data={watchlists} />
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  currentUser: state.user.data
})

const enhance = compose(
  connect(mapStateToProps),
  graphql(PUBLIC_USER_DATA_QUERY, {
    skip: ({ location, match: { params: { id } = {} } = {} }) => {
      const { username } = mapQSToState({ location })
      return !id && !username
    },
    options: props => ({
      variables: getQueryVariables(props)
    }),
    props: ({ data: { getUser, loading, error } }) => ({
      profile: getUser,
      isLoading: loading,
      isError: error
    })
  })
)

const NoProfileData = () => {
  return "User does't exist"
}

export default enhance(ProfilePage)
