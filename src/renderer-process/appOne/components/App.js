import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import logo from './../assets/logo.svg'
import './App.css'
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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">OrderUp: AppOne</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/renderer-process/AppOne/index.js</code> and save to reload.
        </p>
        <button onClick={this.onClickLog}>log orders</button>
        <p>Renderer store: {this.props.orders.length}</p>
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
