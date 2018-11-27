import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { history } from '../../../shared/routers/AppRouter'
import { startAddOrderBackToNewOrdersList } from '../../../shared/actions/lists'
import Header from './Header'
import CompletedOrderExpanded from './CompletedOrderExpanded'

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
          order={ order }
          handleOrderClick={ this.handleOrderClick }
          handleAddOrderBackToNewOrdersClick = { this.handleAddOrderBackToNewOrdersClick }
        />
      )
    } else {
      return (
        <div
          key={ order.id }
          onClick={ () => this.handleOrderClick(order.id) }
        >
          { order.content.location } { order.content.tableNumber }
        </div>
      )
    }
  }

  render = () => (
    <div>
      <Header />
      <input
        type="text"
        placeholder="Search"
        value={ this.state.searchTerm }
        onChange={ this.handleSearchTermChange }
      />
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
  )
}

const mapStateToProps = (state) => ({
  orders : state.lists.completedOrders,
})

const mapDispatchToProps = (dispatch) => ({
  startAddOrderBackToNewOrdersList: (orderId, cb) => dispatch(startAddOrderBackToNewOrdersList(orderId, cb))
})

export default connect(mapStateToProps, mapDispatchToProps)(Completed)