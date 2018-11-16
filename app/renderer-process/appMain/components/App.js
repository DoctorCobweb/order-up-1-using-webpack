import React from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { startSetOrders } from '../../../shared/actions/orders'
import { startSetupLists, startUpdateLists } from '../../../shared/actions/lists'
import OrderList from './OrderList'
import OrderModal from './OrderModal'
import Header from './Header'
import initialData from '../initial-data'
import NewOrdersList from './NewOrdersList'
import BoardList from './BoardList'

export class App extends React.Component {
  state = {
    selectedOrderId: undefined,
    dndData: initialData
  }

  handleOrderClick = (orderId) => {
    this.setState(() => ({
      selectedOrderId: orderId
    }))
  }

  handleClearSelectedOrder = () => {
    this.setState({ selectedOrderId: undefined })
  }

  componentDidMount() {
    // fetch all the orders on app startup.
    // get from mongodb, populate all orders, put in redux store
    // this.props.startSetOrders()

    // this will setup the lists state-slice of redux
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

      this.props.startUpdateLists(newDndState)
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
    this.props.startUpdateLists(newDndState)
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
            />
            <BoardList 
              key={ this.props.lists.lists['board-a'].nameId }
              list={ this.props.lists.lists['board-a'] }
              orders={
                this.props.lists.lists['board-a'].orderIds
                  .map(orderId => this.props.lists.orders[orderId])
              }
              index={ 1 }
            />
            <BoardList 
              key={ this.props.lists.lists['board-b'].nameId }
              list={ this.props.lists.lists['board-b'] }
              orders={
                this.props.lists.lists['board-b'].orderIds
                  .map(orderId => this.props.lists.orders[orderId])
              }
              index={ 2 }
            />
          </div>
          <OrderModal
            selectedOrderId={ this.state.selectedOrderId }
            handleClearSelectedOrder={ this.handleClearSelectedOrder }
          />
        </DragDropContext>
      </div>
    )
  }

  // WORKING OLD VERSION
  // render = () => (
  //   <div className="grid-container">
  //     <Header />
  //     <DragDropContext
  //       onDragStart={ this.onDragStart }
  //       onDragUpdate={ this.onDragUpdate }
  //       onDragEnd={ this.onDragEnd }
  //     >
  //       <OrderList handleOrderClick={ this.handleOrderClick }/>
  //       <BoardContainer />
  //       <OrderModal
  //         selectedOrderId={ this.state.selectedOrderId }
  //         handleClearSelectedOrder={ this.handleClearSelectedOrder }
  //       />
  //     </DragDropContext>
  //   </div>
  // )
}

const mapStateToProps = (state) => ({
  orders: state.orders,
  lists: state.lists,
})

const mapDispatchToProps = (dispatch) => ({
  startSetOrders: () => dispatch(startSetOrders()),
  startSetupLists: () => dispatch(startSetupLists()),
  startUpdateLists: (data) => dispatch(startUpdateLists(data)),
})

const AppConnected = connect(mapStateToProps, mapDispatchToProps)(App)

export default hot(module)(AppConnected) 
