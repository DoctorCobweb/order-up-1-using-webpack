import React from 'react'

export const CompletedOrderExpanded = (props) => {
  return (
    <div
      onClick={ () => props.handleOrderClick(props.order.id) }
    >
      <h3>Completed Order Expanded</h3>
      <div>
        { props.order.content.location } { props.order.content.tableNumber } { props.order.content.clerk }
      </div>
      <button
        onClick={ () => props.handleAddOrderBackToNewOrdersClick(props.order.id) }
      >
        Add back to New Orders list
      </button>
    </div>
  )
}

export default CompletedOrderExpanded