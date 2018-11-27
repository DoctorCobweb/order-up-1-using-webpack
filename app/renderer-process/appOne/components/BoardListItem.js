import React from 'react'
import moment from 'moment'
import { sortCoursesInOrder } from '../../../shared/selectors/lists'


const BoardListItem = props => (
  <div className="board-list-a-item">
    <div className="board-list-a-item-header__container">
      <h1 className="board-list-a-item-header__letter">{ `A${props.index+1}`}</h1>
        <h1
          className={ props.order.location === "RESTAURANT BAR" ?
            "heading-restaurant board-list-a-item-header__table-number"
            :
            props.order.location === "GAMING BAR" ?
            "heading-gaming board-list-a-item-header__table-number"
            :
            "heading-bar board-list-a-item-header__table-number"
          }
        >
          { props.order.tableNumber }
        </h1>
        <h1
          className="board-list-a-item-header__time"
        >
            { moment(props.order.orderReceivedAt).format("HH:mm") }
        </h1>
    </div>
    <div className="board-list-a__course-container">
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
  </div>
)

const Course = (props) => (
  <div
    className={ props.order.location === "RESTAURANT BAR" ?
      "board-list-a__course border-red"
      :
      props.order.location === "GAMING BAR" ?
      "board-list-a__course border-green"
      :
      "board-list-a__course border-blue"
    }
  >
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

export default BoardListItem