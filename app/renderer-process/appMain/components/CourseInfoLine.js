import React from 'react'

const CourseInfoLine = (props) => (
  <div>
    <div>{ props.line.quantity } { props.line.name }</div>
  </div>
)

export default CourseInfoLine

