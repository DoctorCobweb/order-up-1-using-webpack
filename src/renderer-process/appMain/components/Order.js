import React from 'react'
import { connect } from 'react-redux'
import Course from './Course'

const Order = (props) => (
  <div>
    <h2>{ props.order.metaData.location}</h2>
    <div>{ props.order.metaData.orderTakenUsing}</div>
    <div>Clerk: { props.order.metaData.clerk}</div>
    <div>{ props.order.metaData.orderSentAt}</div>
    <h2>Table: { props.order.metaData.tableNumber}</h2>
    { Object.keys(props.order.meals)
        .map(courseName => (
          <Course
            key={ courseName }
            courseName={ courseName }
            courseItems={ props.order.meals[courseName] }
          />
        )
      )
    }
  </div>
)

export default Order