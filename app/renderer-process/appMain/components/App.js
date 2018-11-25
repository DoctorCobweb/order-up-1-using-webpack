import React from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  startSetupLists,
  startUpdateOrderIdsInLists,
  startSetOrderAsCompleted,
} from '../../../shared/actions/lists'
import OrderModal from './OrderModal'
import Header from './Header'
import NewOrdersList from './NewOrdersList'
import BoardList from './BoardList'
import AddOrderModal from './AddOrderModal'

export class App extends React.Component {
  state = {
    selectedOrderId: undefined,
    isAddingNewOrder: false,
  }

  handleOrderClick = (orderId) => {
    this.setState(() => ({
      selectedOrderId: orderId
    }))
  }

  handleClearSelectedOrder = () => {
    this.setState({ selectedOrderId: undefined })
  }
  
  handleAddNewOrderClick = () => {
    this.setState(() => ({
      isAddingNewOrder: true 
    }))

  }
  
  handleCancelAddNewOrder = () => {
    this.setState({ isAddingNewOrder : false })
  }

  handleOrderCompletedClick = (orderId) => {
    console.log('order to set as completed has _id')
    console.log(orderId)

    this.setState(() => ({
      selectedOrderId: undefined,
    }), () => {
      this.props.startSetOrderAsCompleted({ orderId })
    })
  }


  componentDidMount() {
    // this will setup the lists in using mongo & the state-slice of redux
    this.props.startSetupLists()
  }

  onDragStart = start => {
  }

  onDragUpdate = update => {
  }

  onDragEnd = result => {
    console.log(result)
    // typical result obj
    // const result = {
    //   draggableId: 'task-1',
    //   type: 'TYPE',
    //   reason: 'DROP',
    //   source: {
    //     droppableId: 'column-1',
    //     index:0,
    //   },
    //   destination: {
    //     droppableId: 'column-1',
    //     index: 1,
    //   }
    // }
    const { destination, source, draggableId } = result

    // if destination is null then return.
    // this happens when draggable is dragged and dropped 
    // outside the droppable area
    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      // dragged to the same place
      // => do nothing
      return
    }

    const start = this.props.lists.lists[source.droppableId]
    const finish = this.props.lists.lists[destination.droppableId]

    if (start === finish) {
      const newOrderIds = Array.from(start.orderIds)
      // remove 1 item from source.index
      newOrderIds.splice(source.index, 1)

      // at destination.index, dont remove anything, insert draggableId there
      newOrderIds.splice(destination.index, 0, draggableId)

      // now create a new list 
      const newList = {
        ...start,
        orderIds: newOrderIds,
      }

      const newDndState = {
        ...this.props.lists,
        lists: {
          ...this.props.lists.lists,
          [newList.nameId]: newList, // the [] is a computed property name ES6
        },
      }

      this.props.startUpdateOrderIdsInLists(newDndState)
      return
    }

    // moving from one list to another
    const startOrderIds = Array.from(start.orderIds)
    startOrderIds.splice(source.index, 1)
    const newStart = {
      ...start,
      orderIds: startOrderIds,
    }

    const finishOrderIds = Array.from(finish.orderIds)
    finishOrderIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      orderIds: finishOrderIds,
    }

    const newDndState = {
      ...this.props.lists,
      lists: {
        ...this.props.lists.lists,
        [newStart.nameId]: newStart,
        [newFinish.nameId]: newFinish,
      }
    }
    this.props.startUpdateOrderIdsInLists(newDndState)
  }

  render = () => {
    return (
      <div>
        <Header />
        <DragDropContext
          onDragStart={ this.onDragStart }
          onDragUpdate={ this.onDragUpdate }
          onDragEnd={ this.onDragEnd }
        >
          <div className="app-container">
            <NewOrdersList 
              key={ this.props.lists.lists['new-orders'].nameId }
              list={ this.props.lists.lists['new-orders'] }
              orders={ 
                this.props.lists.lists['new-orders'].orderIds
                  .map(orderId => this.props.lists.orders[orderId]) 
              }
              index={ 0 }
              handleOrderClick={ this.handleOrderClick }
              handleAddNewOrderClick = { this.handleAddNewOrderClick }
            />
            <div className="boards-container">
              <BoardList 
                key={ this.props.lists.lists['board-a'].nameId }
                list={ this.props.lists.lists['board-a'] }
                orders={
                  this.props.lists.lists['board-a'].orderIds
                    .map(orderId => this.props.lists.orders[orderId])
                }
                index={ 1 }
                handleOrderClick={ this.handleOrderClick }
              />
              <BoardList 
                key={ this.props.lists.lists['board-b'].nameId }
                list={ this.props.lists.lists['board-b'] }
                orders={
                  this.props.lists.lists['board-b'].orderIds
                    .map(orderId => this.props.lists.orders[orderId])
                }
                index={ 2 }
                handleOrderClick={ this.handleOrderClick }
              />
            </div>
          </div>
          <OrderModal
            selectedOrderId={ this.state.selectedOrderId }
            handleClearSelectedOrder={ this.handleClearSelectedOrder }
            handleOrderCompletedClick={ this.handleOrderCompletedClick }
          />
          <AddOrderModal
            isAddingNewOrder={ this.state.isAddingNewOrder }
            handleCancelAddNewOrder={ this.handleCancelAddNewOrder }
            
          />
        </DragDropContext>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  lists: state.lists,
})

const mapDispatchToProps = (dispatch) => ({
  startSetupLists: () => dispatch(startSetupLists()),
  startUpdateOrderIdsInLists: (data) => dispatch(startUpdateOrderIdsInLists(data)),
  startSetOrderAsCompleted: (data) => dispatch(startSetOrderAsCompleted(data))
})

const AppConnected = connect(mapStateToProps, mapDispatchToProps)(App)

export default hot(module)(AppConnected) 
