import React from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import OrderList from './OrderList'
import OrderModal from './OrderModal'
import Header from './Header'
import BoardContainer from './BoardContainer'
import { startSetOrders } from '../../../shared/actions/orders'

export class App extends React.Component {
  state = {
    selectedOrderId: undefined
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


  }

  render = () => (
    <div className="grid-container">
      <Header />
      <DragDropContext
        onDragStart={ this.onDragStart }
        onDragUpdate={ this.onDragUpdate }
        onDragEnd={ this.onDragEnd }
      >
        <OrderList handleOrderClick={ this.handleOrderClick }/>
        <BoardContainer />
        <OrderModal
          selectedOrderId={ this.state.selectedOrderId }
          handleClearSelectedOrder={ this.handleClearSelectedOrder }
        />
      </DragDropContext>
    </div>
  )
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
