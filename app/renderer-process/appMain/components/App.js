import React from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  startSetupLists,
  startUpdateOrderIdsInList,
  startSetOrderAsCompleted,
  startSetToggleOrderAsPriority
} from '../../../shared/actions/lists'
import OrderModal from './OrderModal'
import Header from './Header'
import NewOrdersList from './NewOrdersList'

export class App extends React.Component {
  state = {
    selectedOrderId: undefined,
    isAddingNewOrder: false,
  }

  componentDidMount() {
    // this will setup the lists in using mongo & the state-slice of redux
    this.props.startSetupLists()
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
    this.setState(() => ({
      selectedOrderId: undefined,
    }), () => {
      this.props.startSetOrderAsCompleted({ orderId })
    })
  }

  handlePriorityClick = (orderId) => {
    console.log(`handlePriorityClick, orderId: ${orderId}`)
    this.props.startSetToggleOrderAsPriority({ orderId })
  }

  onDragStart = start => {
  }

  onDragUpdate = update => {
  }

  onDragEnd = result => {
    // console.log(result)
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
    this.props.startUpdateOrderIdsInList(newDndState)
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
              handlePriorityClick={ this.handlePriorityClick }
            />
          </div>
          <OrderModal
            selectedOrderId={ this.state.selectedOrderId }
            handleClearSelectedOrder={ this.handleClearSelectedOrder }
            handleOrderCompletedClick={ this.handleOrderCompletedClick }
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
  startUpdateOrderIdsInList: (data) => dispatch(startUpdateOrderIdsInList(data)),
  startSetOrderAsCompleted: (data) => dispatch(startSetOrderAsCompleted(data)),
  startSetToggleOrderAsPriority: (data) => dispatch(startSetToggleOrderAsPriority(data)),
})

const AppConnected = connect(mapStateToProps, mapDispatchToProps)(App)

export default hot(module)(AppConnected) 
