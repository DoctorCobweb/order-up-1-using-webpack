import React from 'react'
import logo from './../assets/logo.svg'
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
      <button onClick={ this.handleHomeButtonClick }>Home</button>
      <button onClick={ this.handleCompletedButtonClick }>Completed</button>
      <div className="app-title">OrderUp: AppMain</div>
      <img src={ logo } className="app-logo" alt="logo" />
      <button onClick={ this.handleSettingsButtonClick }>Settings</button>
    </header>
  )
}
