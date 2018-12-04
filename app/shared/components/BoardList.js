import React from 'react'
import BoardListItem from './BoardListItem'

const BoardList = props => (
  <div>
    <div className="board-list-container">
      { props.orders
          .map((order, index) =>
            <BoardListItem
              key={ order.id }
              order={ order.content }
              index={ index }
              screenID={ props.screenID }
            />
          )
      }
    </div>
  </div>
)


export default BoardList