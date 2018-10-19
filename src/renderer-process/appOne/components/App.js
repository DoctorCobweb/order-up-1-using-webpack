import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import logo from './../assets/logo.svg'
import { addOrder } from '../../../shared/actions/orders'
import OrderList from './OrderList'

export class App extends Component {
  constructor(props) {
    super(props)
  }
  onClickLog = () => {
    console.log(this.props.orders)
  }
  render() {
    return (
      <div className="app-one">
        <header className="app-one-header">
          <img src={logo} className="app-one-logo" alt="logo" />
          <h1 className="app-one-title">OrderUp: AppOne</h1>
        </header>
        <button className="button" onClick={this.onClickLog}>log orders</button>
        <p>electron-redux store has {this.props.orders.length} items</p>
        <OrderList/>
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
