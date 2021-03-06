import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import BoardList from './BoardList'

// AppThree  is Board C: all orders in the 'new-orders' list

// 1. order the 'new-orders' by receivedAt timestamp 
//    => I THINK THEY'RE ALREADY ARE (!), due to the nature of how we
//    add ids to orderIds in a list. we push them onto the end. so 
//    as we map over the orderIds (below) the ids are already in chronological
//    order.
//    => need to do nothing
// 2. only first 20 of them to display on grid

const MAX_NUMBER_OF_ITEMS_DISPLAYED = 10

export class AppThree extends Component {

  render = () => {

    const allNewOrders = this.props.lists.lists['new-orders'].orderIds
    .map(orderId => this.props.lists.orders[orderId])

    // only ever take the first 20 orders to display
    let cappedOrders
    if (allNewOrders.length <= MAX_NUMBER_OF_ITEMS_DISPLAYED) {
      cappedOrders = allNewOrders
    } else {
      cappedOrders = allNewOrders.slice(0, MAX_NUMBER_OF_ITEMS_DISPLAYED)
    }

    return <BoardList orders= { cappedOrders } />
  }
}

const mapStateToProps = (state) => ({
  lists: state.lists
})

const mapDispatchToProps = (dispatch) => ({

})

const ConnectedAppThree = connect(mapStateToProps, mapDispatchToProps)(AppThree)
export default hot(module)(ConnectedAppThree) 