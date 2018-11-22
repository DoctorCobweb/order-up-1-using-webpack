import React from 'react'
import moment from 'moment'
import { sortCoursesInOrder } from '../../../shared/selectors/lists'

const BoardListItem = props => (
  <div className="board-list-b-item">
    <div>
      <div className="board-list-b-item__heading">
        <h1 className="board-list-b-item__table-number">{ `B${props.index}`}</h1>
        <h1
          className={ props.order.location === "RESTAURANT BAR" ?
            "heading-restaurant"
            :
            props.order.location === "GAMING BAR" ?
            "heading-gaming"
            :
            "heading-bar"
          }
        >
          { props.order.tableNumber}
        </h1>
      </div>
      <div>Covers: { props.order.covers }</div>
      <div>Order Received: { moment(props.order.orderReceivedAt).format("HH:mm") }</div>
    </div>
    {
      sortCoursesInOrder(props.order).courses
        .map(course => <Course key={ course._id } course={ course } order={ props.order }/>)
    }
    
  </div>
)

const Course = (props) => (
  <div>
    <h3>
      { props.course.name }
      { 
        props.course.name === 'MAINS DINNER' &&  props.order.goOnMains ?
          ` (AWAY @${moment(props.order.goOnMainsStartedAt).format("HH:mm")})`
            :
          ''
      }
      { 
        props.course.name === 'MAINS DINNER' &&  !props.order.goOnMains ?
          ` (HOLD)`
            :
          ''
      }
      { 
        props.course.name === 'BAR MEALS' &&  props.order.goOnMains ?
          ` (AWAY @${moment(props.order.goOnMainsStartedAt).format("HH:mm")})`
            :
          ''
      }
      { 
        props.course.name === 'BAR MEALS' &&  !props.order.goOnMains ?
          ` (HOLD)`
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