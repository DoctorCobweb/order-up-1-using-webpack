import React from 'react'
import { connect } from 'react-redux'
import { history } from '../../../shared/routers/AppRouter'

export class Header extends React.Component {
  handleHomeButtonClick = () => {
    history.push('/home')
  }

  handleCompletedButtonClick = () => {
    history.push('/completed')
  }

  handleSettingsButtonClick = () => {
    history.push('/settings')
  }

  handleAddNewOrderClick = () => {
    history.push('/addNewOrder')
  }

  handleLogListsStateButtonClick = () => {
    console.log(this.props.lists)
  }

  handleLogPrioritiesStateButtonClick = () => {
    console.log(this.props.priorities)
  }

  render = () => (
    <header className="header__container">
      <div>
        <button className="button button--header" onClick={ this.handleHomeButtonClick }>Home</button>
        <button className="button button--header" onClick={ this.handleCompletedButtonClick }>Completed Orders</button>
        <button className="button button--header" onClick={ this.handleSettingsButtonClick }>Settings</button>
        <button className="button button--header" onClick={ this.handleAddNewOrderClick }>Add New Order</button>
        <button className="button button--debug" onClick={ this.handleLogListsStateButtonClick }>Log state.lists</button>
        <button className="button button--debug" onClick={ this.handleLogPrioritiesStateButtonClick }>Log state.priorities</button>
      </div>
    </header>
  )
}

const mapStateToProps = (state) => ({
  lists: state.lists,
  priorities: state.priorities,
})

export default connect(mapStateToProps, null)(Header)