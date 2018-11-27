import React from 'react'

export const CompletedOrder = (props) => (
  <div className="completed-order__container">
    <h3>{ props.order.content.location } { props.order.content.tableNumber }</h3>
    <button
      className="button"
      onClick={ () => props.handleOrderClick(props.order.id) }
    >
      View 
    </button>
  </div>
)

export default CompletedOrder