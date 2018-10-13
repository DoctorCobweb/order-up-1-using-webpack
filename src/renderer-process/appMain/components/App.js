import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addOrder } from '../../../main-process/actions/orders'
import logo from './../assets/logo.svg'
import './App.css'

export class App extends Component {
  constructor(props) {
    super(props)
  }

  onClick = () => {
    this.props.addOrder('yadda')
    console.log(this.props.orders)
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
          To get started, edit <code>src/renderer-process/AppMain/index.js</code> and save to reload.
        </p>
        <button onClick={this.onClick}>click me</button>
        <button onClick={this.onClickLog}>log orders</button>
        <p>renderer store: {this.props.orders.length}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ orders: state })

// action creators??

const mapDispatchToProps = (dispatch) => ({
  addOrder: (order) => dispatch(addOrder(order))
  // TODO
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
