import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import { addOrder } from '../../../shared/actions/orders'
import logo from './../assets/logo.svg'
import OrderList from './OrderList'
import OrderModal from './OrderModal'

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

export default hot(module)(App) 
