import React from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import OrderList from './OrderList'
import OrderModal from './OrderModal'
import Header from './Header'
import { startSetOrders } from '../../../shared/actions/orders'
import initialData from '../initial-data'
import List from './List'
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
    console.log('hello from App.js componentDidMount()')
    // fetch all the orders on app startup.
    // get from mongodb, populate all orders, put in redux store
    this.props.startSetOrders()
  }

  onDragStart = start => {
    console.log('hello from onDragStart')

  }

  onDragUpdate = update => {
    console.log('hello from onDragUpdate')

  }

  onDragEnd = result => {
    console.log('hello from onDragEnd')
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

    const start = this.state.dndData.lists[source.droppableId]
    const finish = this.state.dndData.lists[destination.droppableId]

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
        ...this.state.dndData,
        lists: {
          ...this.state.dndData.lists,
          [newList.id]: newList, // the [] is a computed property name ES6
        },
      }

      this.setState(() => ({
        dndData: newDndState
      }))
      return
    }

    // moving from one list to another
    const startOrderIds = Array.from(start.orderIds)
    startOrderIds.splice(source.index,1)
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
      ...this.state.dndData,
      lists: {
        ...this.state.dndData.lists,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      }
    }
    this.setState(() => ({
      dndData: newDndState
    }))
  }

  render = () => (
    <div>
      <Header />
      <DragDropContext
        onDragStart={ this.onDragStart }
        onDragUpdate={ this.onDragUpdate }
        onDragEnd={ this.onDragEnd }
      >
        <div className="app-container">
          <NewOrdersList 
            key={ this.state.dndData.lists['new-orders'].id }
            list={ this.state.dndData.lists['new-orders'] }
            orders={ this.state.dndData.lists['new-orders'].orderIds.map(orderId => this.state.dndData.orders[orderId]) }
            index={ 0 }
          />
          <BoardList 
            key={ this.state.dndData.lists['board-a'].id }
            list={ this.state.dndData.lists['board-a'] }
            orders={ this.state.dndData.lists['board-a'].orderIds.map(orderId => this.state.dndData.orders[orderId]) }
            index={ 1 }
          />
          <BoardList 
            key={ this.state.dndData.lists['board-b'].id }
            list={ this.state.dndData.lists['board-b'] }
            orders={ this.state.dndData.lists['board-b'].orderIds.map(orderId => this.state.dndData.orders[orderId]) }
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

  // render = () => (
  //   <div>
  //     <Header />
  //     <DragDropContext
  //       onDragStart={ this.onDragStart }
  //       onDragUpdate={ this.onDragUpdate }
  //       onDragEnd={ this.onDragEnd }
  //     >
        
  //       <div className="app-container">
  //         { this.state.dndData.listOrder.map((listId, index) => {
  //           const list = this.state.dndData.lists[listId]
  //           const orders = list.orderIds.map(orderId => this.state.dndData.orders[orderId])
  //           return (
  //             <List 
  //               key={ list.id }
  //               list={ list }
  //               orders={ orders }
  //               index={ index }
  //             />
  //           )
  //         })}
  //       <NewOrdersList />

  //       </div>
  //       <OrderModal
  //         selectedOrderId={ this.state.selectedOrderId }
  //         handleClearSelectedOrder={ this.handleClearSelectedOrder }
  //       />
  //     </DragDropContext>
  //   </div>
  // )

  // WORKING VERSION
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

// TODO?
// const mapStateToProps = (state) => ({
//
// })

const mapDispatchToProps = (dispatch) => ({
  startSetOrders: () => dispatch(startSetOrders())
})

const AppConnected = connect(null, mapDispatchToProps)(App)

export default hot(module)(AppConnected) 
