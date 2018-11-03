import React from 'react'
import { connect } from 'react-redux'
import Course from './Course'
import { findOrder, sortCoursesInOrder } from '../../../shared/selectors/orders'

export class Order extends React.Component { 

  render = () => {
    // console.log('this.props')
    // console.log(this.props)

    return (
      <div>
        <div className="heading">
          <h2>{ this.props.order.location }</h2>
          <h2>Table: { this.props.order.tableNumber }</h2>
        </div>
        <div className="order-meta-details">
          <div>{ this.props.order.orderTakenUsing }</div>
          <div>Clerk: { this.props.order.clerk }</div>
          <div>{ this.props.order.orderSentAt }</div>
        </div>
        { sortCoursesInOrder(this.props.order).courses
            .map(course => 
              <Course
                key={ course._id }
                orderId={ this.props.order._id }
                courseName={ course.name}
                courseId={ course._id }
                courseItems={ course.items }
              />
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  order: findOrder(state, ownProps.orderId)
})

// TODO: add in async action creators
const mapDispatchToProps = (dispatch) => ({
  // blah: (yadda) => dispatch(startUpdateInfo(yadda))
})

export default connect(mapStateToProps, mapDispatchToProps)(Order)