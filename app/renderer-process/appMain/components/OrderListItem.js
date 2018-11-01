import React from 'react'

const OrderListItem = (props) => (
    <div className="list-item">
      <button className="button" onClick={ () => { props.handleOrderClick(props.order._id) }}>
        <p>{ props.order.location }</p>
        <p>Table: { props.order.tableNumber }</p>
        <p>Time: { props.order.orderSentAt }</p>
        <p>Covers: { props.order.covers }</p>
        <p>Booking Name: { props.order.customerName }</p>
      </button>
    </div>
)
export default OrderListItem