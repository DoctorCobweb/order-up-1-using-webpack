import React from 'react'
import moment from 'moment'
import greenDot from '../assets/green-dot.png'
import redDot from '../assets/red-dot.png'

export default class HoldOrAwayOnMains extends React.Component {
  state = {
    minutesAway: 0,
  }

  componentDidMount = () => {
    if (!!this.props.order.goOnMainsStartedAt) {
      this.setState(() => ({
        minutesAway: moment().diff(moment(this.props.order.goOnMainsStartedAt), 'minutes')
      }))
    }
    this.timerID = setInterval(
      () => this.tick(),
      1000 
    )
  }

  componentWillUnmount = () => {
    clearInterval(this.timerID)
  }

  tick = () => {
    if (!!this.props.order.goOnMainsStartedAt) {
      this.setState(() => ({
        minutesAway: moment().diff(moment(this.props.order.goOnMainsStartedAt), 'minutes')
      }))
    }
  }

  render = () => (
    <div>
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
            <div className="board-list__course-mains-timer">
              { `${this.state.minutesAway}mins` }
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
            <div className="board-list__course-mains-timer">
              { `${this.state.minutesAway}mins` }
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
    </div>
  )
}