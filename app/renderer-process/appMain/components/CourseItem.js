import React from 'react'

const CourseItem = (props) => (
  <div className="course-item">
    <div>{ props.quantity } { props.name }</div>
    <div>
      <button onClick={ () => props.handleItemQuantityClick(1) }>+</button>
      <button onClick={ () => props.handleItemQuantityClick(-1) } >-</button>
    </div>
  </div>
)

export default CourseItem