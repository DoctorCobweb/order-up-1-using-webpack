import React from 'react'
import moment from 'moment'
import { sortCoursesInOrder } from '../../../shared/selectors/lists'

class BoardListItem extends React.Component {
  state = {
    timeElapsed: 0,
  }

  componentDidMount = () => {
    this.setState(() => ({
      timeElapsed: moment().diff(moment(this.props.order.orderReceivedAt), 'minutes')
    }))
    setInterval(() => {
      this.setState(() => ({
        timeElapsed: moment().diff(moment(this.props.order.orderReceivedAt), 'minutes')
      }))
    }, 60100)
  }

  render = () => (
    <div className="board-list-item">
      <div className="board-list-item-header__container">
        <h1
          className="board-list-item-header__letter"
        >
          { `C${this.props.index + 1}`}
        </h1>
        <h1
          className={ this.props.order.location === "RESTAURANT BAR" ?
            "heading-restaurant board-list-item-header__table-number"
            :
            this.props.order.location === "GAMING BAR" ?
            "heading-gaming board-list-item-header__table-number"
            :
            "heading-bar board-list-item-header__table-number"
          }
        >
          { this.props.order.tableNumber}
        </h1>
        <div
          className="board-list-item-header__time-container"
        >
          <h1
            className="board-list-item-header__time"
          >
            { moment(this.props.order.orderReceivedAt).format("HH:mm") }
          </h1>
          <h1
            className="board-list-item-header__time"
          >
            { this.state.timeElapsed }
          </h1>
        </div>
      </div>
      <div className="board-list__course-container">
        {
          sortCoursesInOrder(this.props.order).courses
            .map(course =>
              <Course
                key={ course._id }
                course={ course }
                order={ this.props.order }
              />
            )
        }
      </div>
    </div>
  )
}

const Course = (props) => (
  <div
    className={ props.order.location === "RESTAURANT BAR" ?
      "board-list__course border-red"
      :
      props.order.location === "GAMING BAR" ?
      "board-list__course border-green"
      :
      "board-list__course border-blue"
    }
  >
    <h3
      className={ props.course.items.every( item => item.quantity === 0 ) ? "board-list__course-name": "" }
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
          ` (HOLD)`
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
  <div className={ props.item.quantity === 0 ? "board-list__item-container-done" : "" }>
    <div className="board-list__item">{ props.item.quantity } { props.item.name }</div>
    {
      props.item.infos.map(info => <Info key={ info._id } info={ info }/>)
    }
  </div>
)

const Info = (props) => (
  <div className={ props.info.quantity === 0 ? "board-list__info-container-done" : "" }>
    <div className="board-list-item-info-quantity__container">
      <div className="board-list-item-info-quantity__quantity">{ props.info.quantity }</div>
      <div className="board-list-item-info-quantity__info" >
        {
          props.info.infoLines.map(infoLine => <InfoLine key={ infoLine._id } infoLine={ infoLine }/>)
        }
      </div>
    </div>
    <div>------------------------</div>
  </div>
)

const InfoLine = (props) => (
  <div>
    <div>{ props.infoLine.quantity } {props.infoLine.name }</div>
  </div>
)

export default BoardListItem