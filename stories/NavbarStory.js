import React, { Fragment } from 'react'
import { storiesOf } from '@storybook/react'
import StoryRouter from 'storybook-react-router'
import { Provider } from 'react-redux'
import { MockedProvider } from 'react-apollo/test-utils'
import { WatchlistGQL } from './../src/components/WatchlistPopup/WatchlistGQL'
import { Panel } from '@santiment-network/ui'
import Navbar from './../src/components/Navbar/Navbar'
import NavbarProfileDropdown from './../src/components/Navbar/NavbarProfileDropdown'
import NavbarHelpDropdown from './../src/components/Navbar/NavbarHelpDropdown'
import NavbarLabsDropdown from './../src/components/Navbar/NavbarLabsDropdown'
import NavbarAssetsDropdown from './../src/components/Navbar/NavbarAssetsDropdown'
import store from './store'

const mockedData = {
  fetchUserLists: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => ({
    __typename: 'UserList',
    color: 'NONE',
    id: '17' + index,
    insertedAt: '2018-12-01T13:37:02.07080' + index,
    isPublic: Boolean(index % 2),
    listItems: [],
    name: 'Test-' + index,
    updatedAt: '2018-12-21T07:25:02.51675' + index
  }))
}

const mocks = [
  { request: { WatchlistGQL, variables: {} }, result: { data: mockedData } }
]

storiesOf('Navbar', module)
  .addDecorator(StoryRouter())
  .addDecorator(story => (
    <MockedProvider mocks={mocks}>{story()}</MockedProvider>
  ))
  .addDecorator(story => <Provider store={store}>{story()}</Provider>)

  .add('Default', () => (
    <div>
      <Navbar />
      <br />
      {[
        '/sonar',
        '/assets',
        '/insights',
        '/labs/trends',
        '/reports',
        '/support',
        '/account'
      ].map(link => {
        return (
          <Fragment key={link}>
            On the '{link}' page
            <Navbar activeLink={link} />
            <br />
          </Fragment>
        )
      })}
    </div>
  ))
  .add('Profile Dropdown', () => (
    <div>
      <Panel>
        <NavbarProfileDropdown />
      </Panel>
      <br />
      Profile status and picture
      <Panel>
        <NavbarProfileDropdown
          status='active'
          picUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_iB-yPaTXvwWqWiLP3kuHf_WocZXm_uN2lhsNMvkN-BsMLZcDUQ'
        />
      </Panel>
      <br />
      On the '/account' page
      <Panel>
        <NavbarProfileDropdown activeLink='/account' />
      </Panel>
    </div>
  ))
  .add('Help Dropdown', () => (
    <div>
      <Panel>
        <NavbarHelpDropdown />
      </Panel>
      <br />
      On the '/support' page
      <Panel>
        <NavbarHelpDropdown activeLink='/support' />
      </Panel>
    </div>
  ))
  .add('Labs Dropdown', () => (
    <div>
      <Panel>
        <NavbarLabsDropdown />
      </Panel>
      <br />
      On the '/labs/trends' page
      <Panel>
        <NavbarLabsDropdown activeLink='/labs/trends' />
      </Panel>
    </div>
  ))
  .add('Assets Dropdown', () => (
    <div>
      <NavbarAssetsDropdown />
      <br />
      On the '/assets/list?name=top%2050%20erc20%40227#shared' page
      <NavbarAssetsDropdown
        activeLink='/assets/list?name=top%2050%20erc20%40227#shared'
      />
      <br />
      On the '/assets/list?name=Test-0@170#shared' page
      <NavbarAssetsDropdown
        activeLink='/assets/list?name=Test-0@170'
      />
    </div>
  ))
