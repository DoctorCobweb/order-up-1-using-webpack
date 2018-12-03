import React from 'react'
import moment from 'moment'
import { sortCoursesInOrder } from '../../../shared/selectors/lists'
import greenDot from '../assets/green-dot.png'
import redDot from '../assets/red-dot.png'

class BoardListItem extends React.Component {
  state = {
    timeElapsed: 0,
  }

  componentDidMount = () => {
    this.setState(prevState => ({
      timeElapsed: moment().diff(moment(this.props.order.orderReceivedAt), 'minutes')
    }))
    setInterval(() => {
      this.setState((prevState) => ({
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
          { `A${this.props.index+1}` }
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
          { this.props.order.tableNumber }
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

class Course extends React.Component {
  state = {
    minutesAway: 0,
  }

  render = () => (
    <div
      className={ this.props.order.location === "RESTAURANT BAR" ?
        "board-list__course border-red"
        :
        this.props.order.location === "GAMING BAR" ?
        "board-list__course border-green"
        :
        "board-list__course border-blue"
      }
    >
      <h3
        className={ 
          this.props.course.items.every( item => item.quantity === 0 )
          ?
            "board-list__course-name-hide"
          :
            "board-list__course-name__container"
        }
      >
        { this.props.course.name }
        { 
          ( 
            this.props.course.name === 'MAINS DINNER' &&
            this.props.order.goOnMains && 
            !!this.props.order.goOnMainsStartedAt
          ) ?
            <div className="away-on-mains__container">
              <img
                className="away-on-mains"
                src={ greenDot }
                alt="away"
              />
              <div>
                { moment(this.props.order.goOnMainsStartedAt).format("HH:mm") }
              </div>
              <div>
               { setInterval(() => {
                 this.setState(prevState => ({
                   minutesAway: prevState.minutesAway + 1,
                 }))
               }, 1000)}
              </div>
              <div>
                { this.state.minutesAway }
              </div>
            </div>
              :
            ''
        }
        { 
          this.props.course.name === 'MAINS DINNER' &&  !this.props.order.goOnMains ?
            <img
              className="hold-mains"
              src={ redDot }
              alt="hold"
            />
              :
            ''
        }
        { 
          (
            this.props.course.name === 'BAR MEALS' &&
            this.props.order.goOnMains &&
            !!this.props.order.goOnMainsStartedAt
          ) ?
            <div className="away-on-mains__container">
              <img
                className="away-on-mains"
                src={ greenDot }
                alt="away"
              />
              <div>
                { moment(this.props.order.goOnMainsStartedAt).format("HH:mm") }
              </div>
              <div>
                ((( { moment().diff(moment(this.props.order.gonOnMainsStartedAt), 'minutes') } )))
              </div>
            </div>
              :
            ''
        }
        { 
          this.props.course.name === 'BAR MEALS' &&  !this.props.order.goOnMains ?
            <img
              className="hold-mains"
              src={ redDot }
              alt="hold"
              />
              :
            ''
        }
      </h3>
      {
        this.props.course.items.map(item => <Item key={ item._id } item={ item }/>)
      }
    </div>
  )
}

const Item = (props) => (
  <div className={ props.item.quantity === 0 ? "board-list__item-container-done" : ""}>
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