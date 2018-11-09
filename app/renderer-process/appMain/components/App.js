import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import logo from './../assets/logo.svg'
import OrderList from './OrderList'
import OrderModal from './OrderModal'
import { startSetOrders } from '../../../shared/actions/orders'

export class App extends Component {
  state = {
    selectedOrderId: undefined
  }

  handleOrderClick = (orderId) => {
    this.setState(() => ({
      selectedOrderId: orderId
    }))
  }

  handleClearSelectedOrder = () => {
    this.setState({ selectedOrderId: undefined })
  }

  componentDidMount() {
    console.log('hello from App.js componentDidMount()')
    // fetch all the orders on app startup.
    // get from mongodb, populate all orders, put in redux store
    this.props.startSetOrders()
  }

  render = () => (
    <div className="app">
      <header className="app-header">
        <img src={ logo } className="app-logo" alt="logo" />
        <h1 className="app-title">OrderUp: AppMain</h1>
      </header>
      <OrderList handleOrderClick={ this.handleOrderClick }/>
      <OrderModal
        selectedOrderId={ this.state.selectedOrderId }
        handleClearSelectedOrder={ this.handleClearSelectedOrder }
      />
    </div>
  )
}

// TODO?
// const mapStateToProps = (state) => ({
//
// })

const mapDispatchToProps = (dispatch) => ({
  startSetOrders: () => dispatch(startSetOrders())
})

const AppConnected = connect(null, mapDispatchToProps)(App)

export default hot(module)(AppConnected) 
