import React from 'react'
import moment from 'moment'
import { sortCoursesInOrder } from '../../../shared/selectors/lists'

const BoardListItem = props => (
  <div className="board-list-b-item">
    <div>
      <div className="board-list-b-item__heading">
        <h1 className="board-list-b-item__table-number">{ props.order.tableNumber }</h1>
        <h1>{ props.order.location }</h1>
      </div>
      <div>Covers: { props.order.covers }</div>
      <div>Order Received: { moment(props.order.orderReceivedAt).format("HH:mm") }</div>
    </div>
    {
      sortCoursesInOrder(props.order).courses
        .map(course => <Course key={ course._id } course={ course } />)
    }
    
  </div>
)

const Course = (props) => (
  <div>
    <h3>{ props.course.name }</h3>
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
    {
      props.info.infoLines.map(infoLine => <InfoLine key={ infoLine._id } infoLine={ infoLine }/>)
    }
    <div>------------</div>
  </div>
)

const InfoLine = (props) => (
  <div>
    <div>{ props.infoLine.quantity } {props.infoLine.name }</div>
  </div>
)

export default BoardListItem