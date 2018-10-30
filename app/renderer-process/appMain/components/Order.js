import React from 'react'
import { connect } from 'react-redux'
import Course from './Course'

const Order = (props) => {
  console.log('Order props')
  console.log(props)

  return (
    <div>
      <h2>{ props.order.location} /// Table: { props.order.tableNumber}</h2>
      <div className="order-meta-details">
        <div>{ props.order.orderTakenUsing}</div>
        <div>Clerk: { props.order.clerk}</div>
        <div>{ props.order.orderSentAt}</div>
      </div>
      { props.order.courses
          .map(course => (
            <Course
              key= { course._doc._id }
              orderId= { props.order._id }
              courseName={ course._doc.name}
              courseItems={ course._doc.items }
            />
          )
        )
      }
    </div>
  )
}

export default Order