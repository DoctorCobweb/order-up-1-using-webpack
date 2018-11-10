import React from 'react'
import { history } from '../../../shared/routers/AppRouter'

export default class Header extends React.Component {
  handleHomeButtonClick = () => {
    history.push('/home')
  }

  handleCompletedButtonClick = () => {
    history.push('/completed')
  }

  handleSettingsButtonClick = () => {
    history.push('/settings')
  }

  render = () => (
    <header className="item-header header__container">
      <div>
        <button className="button button--header" onClick={ this.handleHomeButtonClick }>Home</button>
        <button className="button button--header" onClick={ this.handleCompletedButtonClick }>Completed Orders</button>
      </div>
      <button className="button button--header" onClick={ this.handleSettingsButtonClick }>Settings</button>
    </header>
  )
}
