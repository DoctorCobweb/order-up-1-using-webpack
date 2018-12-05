import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import moment from 'moment'
import { sortCoursesInOrder } from '../../../shared/selectors/lists'
import greenDot from '../../../shared/assets/green-dot.png'
import redDot from '../../../shared/assets/red-dot.png'
import HoldOrAwayOnMains from '../../../shared/components/HoldOrAwayOnMains'

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

const MAX_NUMBER_OF_NEW_ORDERS_DISPLAYED_ON_BOARD_C = 29

export default class NewOrdersListItem extends React.Component {
  state = {
    orderAgeInMinutes: 0,
  }

  componentDidMount = () => {
    this.setState(() => ({
      orderAgeInMinutes: moment().diff(moment(this.props.order.orderReceivedAt), 'minutes')
    }))

    this.timerID = setInterval(
      () => this.tick(),
      60100
    )
  }

  componentWillUnmount = () => {
    clearInterval(this.timerID)
  }

  tick = () => {
    this.setState(() => ({
      orderAgeInMinutes: moment().diff(moment(this.props.order.orderReceivedAt), 'minutes')
    }))
  }

  render() {
    return (
      <Draggable
        draggableId={ this.props.order._id }
        index={ this.props.index }
      >
        {(provided, snapshot) => (
          <div
            className="new-orders-list-item-dnd"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef} 
          >
            <div
              id={ this.props.order._id }
              className={
                this.props.index > MAX_NUMBER_OF_NEW_ORDERS_DISPLAYED_ON_BOARD_C
                ?
                "blah button--not-on-grid"
                :
                  this.props.order.location === 'RESTAURANT BAR'
                  ? 
                  "blah button--red" 
                  : 
                    this.props.order.location === 'GAMING BAR'
                    ?
                    "blah button--green"
                    :
                    "blah button--blue"
            }
              onClick={ () => { this.props.handleOrderClick(this.props.order._id) } }
            >
              { /* this.props.order.tableNumber */}
              <div className="board-list__course-container">
                { 
                  sortCoursesInOrder(this.props.order).courses
                    .map(course => 
                      <Course
                        key={ course._id }
                        course={ course }
                        order={ this.props.order }
                      />
                    )
                }
              </div>
            </div>
          </div>
        )}
      </Draggable>
    )
  }

  // render() {
  //   return (
  //     <Draggable
  //       draggableId={ this.props.order._id }
  //       index={ this.props.index }
  //     >
  //       {(provided, snapshot) => (
  //         <div
  //           className="new-orders-list-item-dnd"
  //           {...provided.draggableProps}
  //           {...provided.dragHandleProps}
  //           ref={provided.innerRef} 
  //         >
  //           <div
  //             id={ this.props.order._id }
  //             className={
  //               this.props.index > MAX_NUMBER_OF_NEW_ORDERS_DISPLAYED_ON_BOARD_C
  //               ?
  //               "new-orders-list-item-dnd button--not-on-grid"
  //               :
  //                 this.props.order.location === 'RESTAURANT BAR'
  //                 ? 
  //                 "new-orders-list-item-dnd button--red" 
  //                 : 
  //                   this.props.order.location === 'GAMING BAR'
  //                   ?
  //                   "new-orders-list-item-dnd button--green"
  //                   :
  //                   "new-orders-list-item-dnd button--blue"
  //           }
  //             onClick={ () => { this.props.handleOrderClick(this.props.order._id) } }
  //           >
  //             { /* this.props.order.tableNumber */}
  //             { 
  //               sortCoursesInOrder(this.props.order).courses
  //                 .map(course => 
  //                   <Course
  //                     key={ course._id }
  //                     course={ course }
  //                     order={ this.props.order }
  //                   />
  //                 )
  //             }
  //           </div>
  //         </div>
  //       )}
  //     </Draggable>
  //   )
  // }
}

const Course = (props) => (
  <div
    className={ props.order.location === "RESTAURANT BAR" ?
      "board-list__course border-red"
      :
      props.order.location === "GAMING BAR" ?
      "board-list__course border-green"
      :
      "board-list__course border-blue"
    }
  >
    <h3
      className={ 
        props.course.items.every( item => item.quantity === 0 )
        ?
          "board-list__course-name-hide"
        :
          "board-list__course-name__container"
      }
    >
      { props.course.name }
      <HoldOrAwayOnMains 
        order={ props.order }
        course={ props.course }
      />
    </h3>
    {
      props.course.items.map(item => <Item key={ item._id } item={ item }/>)
    }
  </div>
)


const Item = (props) => (
  <div className={ props.item.quantity === 0 ? "board-list__item-container-done" : ""}>
    <div className="board-list__item">{ props.item.quantity } { props.item.name }</div>
    {
      props.item.infos.map(info => <Info key={ info._id } info={ info }/>)
    }
  </div>
)

const Info = (props) => (
  <div className={ props.info.quantity === 0 ? "board-list__info-container-done" : "" }>
    <div className="board-list-item-info-quantity__container">
      <div className="board-list-item-info-quantity__quantity">{ props.info.quantity }</div>
      <div className="board-list-item-info-quantity__info" >
        {
          props.info.infoLines.map(infoLine => <InfoLine key={ infoLine._id } infoLine={ infoLine }/>)
        }
      </div>
    </div>
    <div>------------------------</div>
  </div>
)

const InfoLine = (props) => (
  <div>
    <div>{ props.infoLine.quantity } {props.infoLine.name }</div>
  </div>
)