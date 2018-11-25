import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Header from './Header'

export class Completed extends React.Component {

  state = {
    searchTerm: '',
    expandedRows: [],
  }

  handleSearchTermChange = (e) => {
    this.setState({ searchTerm: e.target.value })
  }

  handleRowClick = (orderId) => {
    console.log(`handleRowClick ${orderId}`)

    const currentExpandedRows = this.state.expandedRows
    const isRowCurrentlyExpanded = currentExpandedRows.includes(orderId)

    const newExpandedRows = isRowCurrentlyExpanded ?
      currentExpandedRows.filter(id => id !== orderId) :
      currentExpandedRows.concat(orderId)

    this.setState({ expandedRows: newExpandedRows })
  }

  componentDidMount = () => {
    console.log('hello from Completed componentDidMount')
  }

  renderOrder = (order) => {
    console.log('what is this?')
    console.log(this)
    console.log(this.state)
    console.log(typeof this.state.expandedRows)
    if (this.state.expandedRows.includes(order.id)) {
      return (
        <div
          key={ order.id }
          onClick={ () => this.handleRowClick(order.id) }
        >
          <h3>Expanded row</h3>
          <div>
            { order.content.location } { order.content.tableNumber } { order.content.clerk }
          </div>
        </div>
      )
    } else {
      return (
        <div
          key={ order.id }
          onClick={ () => this.handleRowClick(order.id) }
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Completed)