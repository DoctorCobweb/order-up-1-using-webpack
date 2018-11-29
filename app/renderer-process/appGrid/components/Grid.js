import React from 'react'
import GridItem from './GridItem'

export const Grid = (props) => {
  return (
    <div className="grid-container" >
      {
        props.orders
          .map((order, index) =>
            <GridItem
              key={ order.id}
              order={ order.content }
              index={ index }
            />
          )
      }
    </div>
  )
}

export default Grid