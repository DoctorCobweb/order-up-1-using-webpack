import React from 'react'
import moment from 'moment'
import { sortCoursesInOrder } from '../../../shared/selectors/lists'

const indexMapping = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G',
  7: 'H',
  8: 'I',
  9: 'J',
  10: 'K',
  11: 'L',
  12: 'M',
  13: 'N',
  14: 'O',
  15: 'P',
  16: 'Q',
  17: 'R',
  18: 'S',
  19: 'T',
}

export const GridItem = (props) => (
  <div className={`grid-item grid-item-${ props.index }`}>
    <div>{ indexMapping[props.index]}</div>
    <div>
      <h3>{ props.order.tableNumber }</h3>
      <h3
        className={ props.order.location === "RESTAURANT BAR" ?
          "heading-restaurant"
          :
          props.order.location === "GAMING BAR" ?
          "heading-gaming"
          :
          "heading-bar"
        }
      >
        { props.order.location }
      </h3>
    </div>
    {
      sortCoursesInOrder(props.order).courses
        .map(course => <Course key={ course._id } course={ course } order={ props.order }/>)
    }
  </div>
)

const Course = (props) => (
  <div>
    <h4
    >
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
    </h4>
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

export default GridItem