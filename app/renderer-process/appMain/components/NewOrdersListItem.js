import React from 'react'
import { connect } from 'react-redux'
import { Draggable } from 'react-beautiful-dnd'
import moment from 'moment'
import { sortCoursesInOrder } from '../../../shared/selectors/lists'
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

export class NewOrdersListItem extends React.Component {
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

    const hasAPriority = _.values(this.props.priorities).includes(this.props.order._id)
    let orderPriority 
    if (hasAPriority) {
      orderPriority = _.invert(this.props.priorities)[this.props.order._id]
    }

    return (
      <Draggable
        draggableId={ this.props.order._id }
        index={ this.props.index }
      >
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef} 
            className={ this.props.index <= 29 ? "new-orders-list-item": "new-orders-list-item item-not-displayed-background"}
          >
            <div className={ hasAPriority ? "button-new-order-item__container priority" : "button-new-order-item__container"}>
              <h1>{ orderPriority }</h1>
              {
                this.props.index <= 29 &&
                  <button
                    className="button-new-order-item button--grey"
                    onClick={ () => this.props.handlePriorityClick(this.props.order._id) }
                  >
                    Prioritise
                  </button>
              }
            </div>
            <div
              onClick={ () => { this.props.handleOrderClick(this.props.order._id) } }
            >
              <div className="new-orders-list-item-header__container">

                <h1 className="new-orders-list-item-header__letter">
                  { 
                    this.props.index <=9
                    ?
                    `A${this.props.index+1}`
                    :
                      this.props.index <=19
                      ?
                      `B${this.props.index+1 - 10}`
                      :
                        this.props.index <= 29
                        ?
                        `C${this.props.index+1 - 20}`
                        :
                        'N/A'
                  }
                </h1>
                <h1
                  className={ this.props.order.location === "RESTAURANT BAR" ?
                    "heading-restaurant new-orders-list-item-header__table-number"
                    :
                    this.props.order.location === "GAMING BAR" ?
                    "heading-gaming new-orders-list-item-header__table-number"
                    :
                    "heading-bar new-orders-list-item-header__table-number"
                  }
                >
                  { this.props.order.tableNumber }
                </h1>
                <div className="new-orders-list-item-header__time-container">
                  <h1 className="new-orders-list-item-header__time">
                    { moment(this.props.order.orderReceivedAt).format("HH:mm") }
                  </h1>
                  <h1 className="new-orders-list-item-header__time">
                    { this.state.orderAgeInMinutes }mins
                  </h1>
                </div>
              </div>
              <div className="new-orders-list__course-container">
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
}

const Course = (props) => (
  <div
    className={ props.order.location === "RESTAURANT BAR" ?
      "new-orders-list__course new-orders-border-red"
      :
      props.order.location === "GAMING BAR" ?
      "new-orders-list__course new-orders-border-green"
      :
      "new-orders-list__course new-orders-border-blue"
    }
  >
    <h3
      className={ 
        props.course.items.every( item => item.quantity === 0 )
        ?
          "new-orders-list__course-name-hide"
        :
          "new-orders-list__course-name__container"
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
  <div className={ props.item.quantity === 0 ? "new-orders-list__item-container-done" : ""}>
    <div className="new-orders-list__item">{ props.item.quantity } { props.item.name }</div>
    {
      props.item.infos.map(info => <Info key={ info._id } info={ info }/>)
    }
  </div>
)

const Info = (props) => (
  <div className={ props.info.quantity === 0 ? "new-orders-list__info-container-done" : "" }>
    <div className="new-orders-list-item-info-quantity__container">
      <div className="new-orders-list-item-info-quantity__quantity">{ props.info.quantity }</div>
      <div className="new-orders-list-item-info-quantity__info" >
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


const mapStateToProps = (state) => ({
  priorities: state.priorities,
})

export default connect(mapStateToProps, null)(NewOrdersListItem)