import React from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import _ from 'lodash'
import { history } from '../../../shared/routers/AppRouter'
import { startAddOrderBackToNewOrdersList } from '../../../shared/actions/lists'
import Header from './Header'
import CompletedOrderExpanded from './CompletedOrderExpanded'
import CompletedOrder from './CompletedOrder'

export class Completed extends React.Component {

  state = {
    searchTerm: '',
    expandedRows: [],
  }

  handleSearchTermChange = (e) => {
    this.setState({ searchTerm: e.target.value })
  }

  handleOrderClick = (orderId) => {

    const currentExpandedRows = this.state.expandedRows
    const isRowCurrentlyExpanded = currentExpandedRows.includes(orderId)

    const newExpandedRows = isRowCurrentlyExpanded ?
      currentExpandedRows.filter(id => id !== orderId) :
      currentExpandedRows.concat(orderId)

    this.setState({ expandedRows: newExpandedRows })
  }

  handleAddOrderBackToNewOrdersClick = (orderId) => {
    this.props.startAddOrderBackToNewOrdersList(orderId, () => {
      alert('Success. Order has now been moved to the bottom of the New Orders list.')
      history.push('/home')
    })

  }

  renderOrder = (order) => {
    if (this.state.expandedRows.includes(order.id)) {
      return (
        <CompletedOrderExpanded
          key={ order.id }
          order={ order.content }
          handleOrderClick={ this.handleOrderClick }
          handleAddOrderBackToNewOrdersClick = { this.handleAddOrderBackToNewOrdersClick }
        />
      )
    } else {
      return (
        <CompletedOrder
          key={ order.id } 
          order={ order }
          handleOrderClick={ this.handleOrderClick }
        />
      )
    }
  }

  render = () => (
    <div>
      <Header />
      <div className="completed-content__container">
        <h1 className="heading">Completed Orders</h1>
        <input
          className="completed-search-input"
          type="text"
          placeholder="Search"
          value={ this.state.searchTerm }
          onChange={ this.handleSearchTermChange }
        />
        <div className="completed-content__container">
          {
            _.values(this.props.orders)
              .filter(
                order =>
                  `${order.content.location} ${order.content.tableNumber}`
                    .toUpperCase()
                    .indexOf(this.state.searchTerm.toUpperCase()) >= 0
              )
              .map(
                (order, index) =>
                  this.renderOrder(order)
              )
          }
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  orders : state.lists.completedOrders,
})

const mapDispatchToProps = (dispatch) => ({
  startAddOrderBackToNewOrdersList: (orderId, cb) => dispatch(startAddOrderBackToNewOrdersList(orderId, cb))
})

const CompletedConnected = connect(mapStateToProps, mapDispatchToProps)(Completed)

export default hot(module)(CompletedConnected)
// export default CompletedConnected