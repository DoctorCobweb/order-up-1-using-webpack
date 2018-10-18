import React from 'react'
import { connect } from 'react-redux'

export default class Order extends React.Component {
  render() {
    return (
      <div>
        <h2>{ this.props.order.metaData.location}</h2>
        <h5>{ this.props.order.metaData.orderTakenUsing}</h5>
        <h5>Clerk: { this.props.order.metaData.clerk}</h5>
        <h5>{ this.props.order.metaData.orderSentAt}</h5>
        <h2>{ this.props.order.metaData.tableNumber}</h2>
      </div>
    )
  }
}