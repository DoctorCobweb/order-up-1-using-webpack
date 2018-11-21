import React from 'react'
import BoardListItem from './BoardListItem'

const BoardList = props => (
  <div>
    <h1 className="heading">Board B</h1>
    <div className="board-list-b-container">
      { props.orders
          .map(order =>
            <BoardListItem
              key={ order.id }
              order={ order.content }
            />
          )
      }
    </div>
  </div>
)


export default BoardList