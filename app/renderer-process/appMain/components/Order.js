import React from 'react'
import { connect } from 'react-redux'
import Course from './Course'
import { startUpdateInfo } from '../../../shared/actions/orders'

export const Order = (props) => (
  <div>
    <h2>{ props.order.location } /// Table: { props.order.tableNumber }</h2>
    <div className="order-meta-details">
      <div>{ props.order.orderTakenUsing }</div>
      <div>Clerk: { props.order.clerk }</div>
      <div>{ props.order.orderSentAt }</div>
    </div>
    { props.order.courses
        .map(course => (
          <Course
            key={ course._id }
            orderId={ props.order._id }
            courseName={ course.name}
            courseItems={ course.items }
          />
        )
      )
    }
  </div>
)


const mapStateToProps = (state) => ({
  orders: state
})

// TODO: add in async action creators
const mapDispatchToProps = (dispatch) => ({
  blah: (yadda) => dispatch(startUpdateInfo(yadda))
})

export default connect(mapStateToProps, mapDispatchToProps)(Order)