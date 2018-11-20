import React from 'react'

const BoardListItem = props => (
  <div>
    { props.order.location } // Table Number: { props.order.tableNumber } // Covers: { props.order.covers }
  </div>
)

export default BoardListItem