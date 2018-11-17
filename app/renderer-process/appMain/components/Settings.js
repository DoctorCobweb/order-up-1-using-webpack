import React from 'react'
import { connect } from 'react-redux'
import { history } from 'history/createBrowserHistory'
import Header from './Header'
// import { startDeleteAllOrders } from '../../../shared/actions/orders'
import { startDeleteAllOrders } from '../../../shared/actions/lists'

export class Settings extends React.Component {
  handleDeleteAllOrders = () => {
    this.props.startDeleteAllOrders()
  }


  render = () => (
    <div>
      <Header />
      <div>
        <h2>Start service with a fresh Board</h2>
        <p>this will clear out mongodb collections and redux store => start from default state</p>
        <button onClick={ this.handleDeleteAllOrders }>Delete all orders</button>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  startDeleteAllOrders: () => dispatch(startDeleteAllOrders())
})

export default connect(null, mapDispatchToProps)(Settings)