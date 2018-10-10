import React, { Component } from 'react'
import logo from './../assets/logo.svg'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">OrderUp: AppOne</h1>
        </header>
        <p className="App-intro">
          To get get started, edit <code>src/renderer-process/AppOne/index.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App
