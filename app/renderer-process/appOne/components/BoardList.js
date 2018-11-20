import React from 'react'
import BoardListItem from './BoardListItem'

const BoardList = props => (
  <div>
    { props.orders
        .map(order =>
          <BoardListItem
            key={ order.id }
            order={ order.content }
          />
        )
    }
  </div>
)


export default BoardList