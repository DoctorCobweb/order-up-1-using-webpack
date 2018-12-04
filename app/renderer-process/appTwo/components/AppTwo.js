import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import BoardList from '../../../shared/components/BoardList'

// AppTwo displays orders 11-20

export class AppTwo extends Component {

  render = () => (
    <BoardList
      orders={
        this.props.lists.lists['new-orders'].orderIds
          .map(orderId => this.props.lists.orders[orderId]).slice(10,20)
      }
      screenID='B'
    />
  )
}

const mapStateToProps = (state) => ({
  lists: state.lists
})

const mapDispatchToProps = (dispatch) => ({

})

const ConnectedAppTwo = connect(mapStateToProps, mapDispatchToProps)(AppTwo)
export default hot(module)(ConnectedAppTwo) 