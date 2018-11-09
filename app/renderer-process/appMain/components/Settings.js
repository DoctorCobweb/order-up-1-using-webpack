import React from 'react'
import { connect } from 'react-redux'
import { history } from 'history/createBrowserHistory'
import Header from './Header'
import { startDeleteAllOrders } from '../../../shared/actions/orders'

export class Settings extends React.Component {
  handleDeleteAllOrders = () => {
    console.log('deleting all orders: remove all documents from all collections in OrderUpDb')
    this.props.startDeleteAllOrders()
  }


  render = () => (
    <div>
      <Header />
      <div>
        <h2>Start service with a fresh Board</h2>
        <button onClick={ this.handleDeleteAllOrders }>Delete all orders</button>
      </div>
      <p>Settings component</p>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  startDeleteAllOrders: () => dispatch(startDeleteAllOrders())
})

export default connect(null, mapDispatchToProps)(Settings)