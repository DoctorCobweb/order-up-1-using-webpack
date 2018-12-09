import React from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import {
  DragDropContext,
  Droppable,
  Draggable 
} from 'react-beautiful-dnd'
import {
  startSetupLists,
  startUpdateOrderIdsInList,
  startSetOrderAsCompleted,
  startSetToggleOrderAsPriority
} from '../../../shared/actions/lists'
import {
  startSetupPriorities,
  startSetPriority,
  startRemoveOrderFromPriorities,
} from '../../../shared/actions/priorities'
import OrderModal from './OrderModal'
import Header from './Header'
import NewOrdersList from './NewOrdersList'
import PriorityModal from './PriorityModal'

export class App extends React.Component {
  state = {
    selectedOrderId: undefined,
    isAddingNewOrder: false,
    isPrioritisingOrder: false,
    prioritisingOrderId: '',
  }

  componentDidMount() {
    // this will setup the lists in using mongo & the state-slice of redux
    this.props.startSetupLists()

    // this will setup the priorites in monge & the priorities state-slice in redux
    this.props.startSetupPriorities()
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
      // if the order was set as a priority, we must also
      // updated the priorities document in mongo
      if (_.values(this.props.priorities).includes(orderId) ) {
      // if the order was set as a priority, we must also
        // order has a priority set to it.
        this.props.startRemoveOrderFromPriorities({ orderId })
      }
    })
  }

  handlePriorityClick = (orderId) => {
    this.setState(() => ({
      isPrioritisingOrder: true,
      prioritisingOrderId: orderId,
    }))
  }

  handleClearPrioritiseOrder = () => {
    this.setState(() => ({
      isPrioritisingOrder: false,
      prioritisingOrderId: '',
    }))
  }

  handleSelectPriority = (priority) => {
    // cannot select a priority which is already assigned
    if (this.props.priorities[priority]) return 

    this.props.startSetPriority({ priority, prioritisingOrderId: this.state.prioritisingOrderId })
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
          <PriorityModal
            isPrioritisingOrder={ this.state.isPrioritisingOrder }
            handleClearPrioritiseOrder={ this.handleClearPrioritiseOrder}
            handleSelectPriority={ this.handleSelectPriority }
            prioritisingOrderId={ this.state.prioritisingOrderId }
          />
        </DragDropContext>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  lists: state.lists,
  priorities: state.priorities,
})

const mapDispatchToProps = (dispatch) => ({
  startSetupLists: () => dispatch(startSetupLists()),
  startUpdateOrderIdsInList: (data) => dispatch(startUpdateOrderIdsInList(data)),
  startSetOrderAsCompleted: (data) => dispatch(startSetOrderAsCompleted(data)),
  startSetToggleOrderAsPriority: (data) => dispatch(startSetToggleOrderAsPriority(data)),
  startSetupPriorities: () => dispatch(startSetupPriorities()),
  startSetPriority: (data) => dispatch(startSetPriority(data)),
  startRemoveOrderFromPriorities: (data) => dispatch(startRemoveOrderFromPriorities(data)),
})

const AppConnected = connect(mapStateToProps, mapDispatchToProps)(App)

export default hot(module)(AppConnected) 
