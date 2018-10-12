import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from './../assets/logo.svg'
import './App.css'

export class App extends Component {
  constructor(props) {
    super(props)
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
        <p>renderer store: {this.props.orders.length}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    orders: state
  }
}

export default connect(mapStateToProps)(App)
