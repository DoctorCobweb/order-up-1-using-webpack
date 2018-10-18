import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import { addOrder } from '../../../shared/actions/orders'
import logo from './../assets/logo.svg'
import OrderList from './OrderList'
import OrderModal from './OrderModal'

export class App extends Component {
  state = {
    counter: 0,
    selectedOrder: undefined
  }

  constructor(props) {
    super(props)
  }

  onClickLog = () => {
    console.log(this.props.orders)
  }

  handleOrderClick = (orderId) => {
    console.log(`in App/handleOrderClick() called with id: ${orderId}`)
    this.setState(() => ({
      selectedOrder: orderId
    }))
  }

  handleClearSelectedOrder = () => {
    this.setState({ selectedOrder: undefined })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">OrderUp: AppMain</h1>
        </header>
        <button className="button" onClick={this.onClickLog}>console.log orders</button>
        <p>electron-redux store has {this.props.orders.length} items</p>
        <OrderList handleOrderClick={this.handleOrderClick}/>
        <OrderModal selectedOrder={this.state.selectedOrder} handleClearSelectedOrder={this.handleClearSelectedOrder}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ orders: state })

const mapDispatchToProps = (dispatch) => ({
  addOrder: (order) => dispatch(addOrder(order))
})

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)
export default hot(module)(ConnectedApp) 