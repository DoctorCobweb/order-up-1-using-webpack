import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import NewOrdersListItem from './NewOrdersListItem'


// const Container = styled.div`
//   margin: 8px;
//   border: 1px solid lightgrey;
//   background-color: white;
//   border-radius: 2px;
//   width: 220px;

//   display: flex;
//   flex-direction: column;
// `
// const Title = styled.h3`
//   padding: 8px;
// `
// const TaskList = styled.div`
//   background-color: ${props => (props.isDraggingOver ? 'skyblue': 'inherit')}
//   padding: 8px;
//   flex-grow: 1; // so row grows to full container height when no items present => can drop stuff on there still
//   min-height: 100px;
// `

export default class NewOrdersList extends React.Component {
  render() {
    return (
      <div className="new-orders-list-container">
        <h3>{ this.props.list.title } : { this.props.list.direction } </h3>
        <Droppable 
          droppableId={ this.props.list.id }
          direction={ this.props.list.direction }
        >
          { (provided, snapshot) => (
            <div
              ref={ provided.innerRef } //
              { ...provided.droppableProps }
              className="new-orders-list"
            >
              { this.props.orders
                  .map((order, index) => 
                    <NewOrdersListItem key={ order.id } order={ order } index={ index } />
                  )
              }
              { provided.placeholder }
            </div>
          )}
        </Droppable>
      </div>
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
