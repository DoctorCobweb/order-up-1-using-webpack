import React from 'react'
import moment from 'moment'
import { sortCoursesInOrder } from '../../../shared/selectors/lists'

export const CompletedOrderExpanded = (props) => {
  return (
    <div className="completed-order-expanded__container">
      <h2>
        { props.order.location } { props.order.tableNumber } -- Completed
      </h2>
      <div className="completed-order-expanded__buttons-container">
        <button
          className="button button--green"
          onClick={ () => props.handleAddOrderBackToNewOrdersClick(props.order._id) }
        >
          Put back into New Orders list
        </button>
        <button
          className="button button--red"
          onClick={ () => props.handleOrderClick(props.order._id) }
        >
          Cancel
        </button>
      </div>
      {
        sortCoursesInOrder(props.order).courses
          .map(course =>
            <Course
              key={ course._id }
              course={ course }
              order={ props.order }
            />
          )
      }
    </div>
  )
}

const Course = (props) => (
  <div className="completed-order-expanded__course">
    <h3
    >
      { props.course.name }
      { 
        (
          props.course.name === 'MAINS DINNER' &&
          props.order.goOnMains && 
          !!props.order.goOnMainsStartedAt
        ) ?
          ` (AWAY @${moment(props.order.goOnMainsStartedAt).format("HH:mm")})`
            :
          ''
      }
      { 
        props.course.name === 'MAINS DINNER' &&  !props.order.goOnMains ?
          ` ---------- HOLD ----------`
            :
          ''
      }
      { 
        (
          props.course.name === 'BAR MEALS' &&
          props.order.goOnMains &&
          !!props.order.goOnMainsStartedAt
        ) ?
          ` (AWAY @${moment(props.order.goOnMainsStartedAt).format("HH:mm")})`
            :
          ''
      }
      { 
        props.course.name === 'BAR MEALS' &&  !props.order.goOnMains ?
          `----------`
            :
          ''
      }
    </h3>
    {
      props.course.items.map(item => <Item key={ item._id } item={ item }/>)
    }
  </div>
)

const Item = (props) => (
  <div>
    <div>{ props.item.quantity } { props.item.name }</div>
    {
      props.item.infos.map(info => <Info key={ info._id } info={ info }/>)
    }
  </div>
)

const Info = (props) => (
  <div>
    <div>
      <div>{ props.info.quantity }</div>
      {
        props.info.infoLines.map(infoLine => <InfoLine key={ infoLine._id } infoLine={ infoLine }/>)
      }
      <div>------------</div>
    </div>
  </div>
)

const InfoLine = (props) => (
  <div>
    <div>{ props.infoLine.quantity } {props.infoLine.name }</div>
  </div>
)



export default CompletedOrderExpanded