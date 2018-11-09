import React from 'react'


const customizeButton = (props) => {
  const location = props.order.location
  if (location === 'RESTAURANT BAR') {
    return (
      <button className="button button--restaurant" onClick={() => { props.handleOrderClick(props.order._id) }}>
        <div>{props.order.location} / T: {props.order.tableNumber} / C: {props.order.covers}</div>
      </button>
    )
  } else if (location === 'GAMING BAR') {
    return (
      <button className="button button--gaming" onClick={() => { props.handleOrderClick(props.order._id) }}>
        <div>{props.order.location} / T: {props.order.tableNumber} / C: {props.order.covers}</div>
      </button>
    )
  } else {
    return (
      <button className="button button--bar" onClick={() => { props.handleOrderClick(props.order._id) }}>
        <div>{props.order.location} / T: {props.order.tableNumber} / C: {props.order.covers}</div>
      </button>

    )
  }

}


const OrderListItem = (props) => (
  <div className="list-item">
    {customizeButton(props)}
  </div>
)
export default OrderListItem