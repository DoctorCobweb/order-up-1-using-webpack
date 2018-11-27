import React from 'react'
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux'
import { history } from '../../../shared/routers/AppRouter'
import Header from './Header'
import WarningModal from './WarningModal'
import { startDeleteAllOrders } from '../../../shared/actions/lists'

export class Settings extends React.Component {
  state = {
    displayWarningModal : false,
  }

  handleIntentToDeleteAllOrdersClick = () => {
    this.setState({ displayWarningModal: true })
  }

  handleConfirmDeleteAllOrdersClick = () => {
    this.props.startDeleteAllOrders()
    this.setState({ displayWarningModal: false })
    history.push('/home')
  }

  handleCancelDeleteAllOrdersClick = () => {
    this.setState({ displayWarningModal: false })
  }


  render = () => (
    <div>
      <Header />
      <div className="settings__container">
        <h2>Delete All Orders</h2>
        <p>This will remove every order from every screen (including all iPads). It's okay to do this if you want to start the service with an entirely clean app.</p>
        <p>JUST DONT DO IT IN THE MIDDLE OF SERVICE.</p>
        <button
          className="button button--red"
          onClick={ this.handleIntentToDeleteAllOrdersClick }
        >
          Delete all orders
        </button>
      </div>
      <WarningModal
        handleConfirmDeleteAllOrdersClick={ this.handleConfirmDeleteAllOrdersClick }
        handleCancelDeleteAllOrdersClick={ this.handleCancelDeleteAllOrdersClick }
        displayWarningModal={ this.state.displayWarningModal }
      />
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  startDeleteAllOrders: () => dispatch(startDeleteAllOrders())
})

const ConnectedSettings = connect(null, mapDispatchToProps)(Settings)

export default hot(module)(ConnectedSettings)
