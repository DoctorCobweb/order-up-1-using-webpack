import React from 'react'
import logo from './../assets/logo.svg'

export const Header = () => (
  <header className="item-header header__container">
    <button>Board</button>
    <button>Completed</button>
    <div className="app-title">OrderUp: AppMain</div>
    <img src={ logo } className="app-logo" alt="logo" />
    <button>Settings</button>
  </header>
)

export default Header