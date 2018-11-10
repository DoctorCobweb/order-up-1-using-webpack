import React from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import logo from './../assets/logo.svg'
import OrderList from './OrderList'
import OrderModal from './OrderModal'
import Header from './Header'
import Board from './Board'
import { startSetOrders } from '../../../shared/actions/orders'

export class App extends React.Component {
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

  componentDidMount() {
    console.log('hello from App.js componentDidMount()')
    // fetch all the orders on app startup.
    // get from mongodb, populate all orders, put in redux store
    this.props.startSetOrders()
  }

  render = () => (
    <div className="grid-container">
      <Header />
      <OrderList handleOrderClick={ this.handleOrderClick }/>
      <Board />
      <OrderModal
        selectedOrderId={ this.state.selectedOrderId }
        handleClearSelectedOrder={ this.handleClearSelectedOrder }
      />
    </div>
  )
}

// TODO?
// const mapStateToProps = (state) => ({
//
// })

const mapDispatchToProps = (dispatch) => ({
  startSetOrders: () => dispatch(startSetOrders())
})

const AppConnected = connect(null, mapDispatchToProps)(App)

export default hot(module)(AppConnected) 
