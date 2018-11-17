import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'

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
    return (
      <div className="app-one">
        <h1>TODO</h1>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ orders: state })
const mapDispatchToProps = (dispatch) => ({ })
const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)
export default hot(module)(ConnectedApp) 