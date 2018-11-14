import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

// const Container = styled.div`
//   background-color: ${props =>
//     props.isDragDisabled
//       ? 'lightgrey'
//       : props.isDragging
//         ? 'lightgreen'
//         : 'white'};
//   border: 1px solid lightgrey;
//   border-radius: 2px;
//   padding: 8px;
//   margin-bottom: 8px;

//   display: flex;

// `

// const Handle = styled.div`
//   width: 20px;
//   height: 20px;
//   background-color: orange;
//   border-radius: 4px;
//   margin-right: 8px;
// `

export default class NewOrdersListItem extends React.Component {
  render() {
    return (
      <Draggable
        draggableId={this.props.order.id}
        index={this.props.index}
      >
        {(provided, snapshot) => (
          <div
            className="new-orders-list-item-dnd"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef} 
          >
            {this.props.order.content}
          </div>
        )}
      </Draggable>
    )
  }
}

// example draggable snapshot obj
// const draggableSnapshot = {
//   isDragging: true,
//   draggingOver: 'column-1',
// }

// and droppable snapshot obj
// const droppableSnapshot = {
//   isDraggingOver: true,
//   draggingOverWith: 'task-1',
// }
