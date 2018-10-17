import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import { addOrder } from '../../../shared/actions/orders'
import logo from './../assets/logo.svg'
import './App.css'
import OrderList from './OrderList'

export class App extends Component {
  state = {
    counter: 0
  }

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
          <h1 className="App-title">OrderUp: AppMain</h1>
        </header>
        <p className="App-intro">
          Tooooo GET started, edit <code>src/renderer-process/AppMain/index.js</code> and save to reload.
        </p>
        <button onClick={this.onClickLog}>log orders</button>
        <h2>COUNTER: {this.state.counter}</h2>
        <button onClick={() => {
          this.setState((prevState) => ({
            counter: prevState.counter + 1
          }))
        }}>
          inc counter
        </button>
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