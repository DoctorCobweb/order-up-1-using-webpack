import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import { addOrder } from '../../../shared/actions/orders'
import logo from './../assets/logo.svg'
import OrderList from './OrderList'
import OrderModal from './OrderModal'

export class App extends Component {
  state = {
    selectedOrder: undefined
  }

  onClickLog = () => {
    console.log(this.props.orders)
  }

  handleOrderClick = (order) => {
    this.setState(() => ({
      selectedOrder: order
    }))
  }

  handleClearSelectedOrder = () => {
    this.setState({ selectedOrder: undefined })
  }

  render() {
    // console.log('App.js this.props.orders:')
    // console.log(this.props.orders)
    return (
      <div className="app">
        <header className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <h1 className="app-title">OrderUp: AppMain</h1>
        </header>
        <button className="button" onClick={this.onClickLog}>console.log orders</button>
        <p>electron-redux store has {this.props.orders.length} items</p>
        <OrderList handleOrderClick={this.handleOrderClick}/>
        <OrderModal
          selectedOrder={this.state.selectedOrder}
          handleClearSelectedOrder={this.handleClearSelectedOrder}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ orders: state })

const mapDispatchToProps = (dispatch) => ({
  addOrder: (order) => dispatch(addOrder(order)) // TODO: fix/implement
})

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)
export default hot(module)(ConnectedApp) 