import React from 'react'

const CourseItemInfoLine = (props) => (
  <div>
    <div>{ props.line.quantity } { props.line.name }</div>
  </div>
)

export default CourseItemInfoLine

