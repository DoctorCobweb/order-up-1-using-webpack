import React from 'react'

const OrderListItem = (props) => (
  <div>
    <p>{props.metaData.location} Table: {props.metaData.tableNumber}</p>
    <p>Time: {props.metaData.orderSentAt}</p>
    <p>Covers: {props.metaData.covers}</p>
    <p>Booking Name: {props.metaData.customerName}</p>
  </div>
)

export default OrderListItem
