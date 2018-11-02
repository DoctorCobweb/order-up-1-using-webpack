import React from 'react'

const CourseItem = (props) => (
  <div className="course-item">
    <div className="course-item__container">
      <div className="course-item__quantity">{ props.quantity }</div>
      <div>{ props.name }</div>
    </div>
    <div className="button__stack">
      <button className="button-button__stack" onClick={ () => props.handleItemQuantityClick(1) }>+</button>
      <button className="button-button__stack" onClick={ () => props.handleItemQuantityClick(-1) } >-</button>
    </div>
  </div>
)

export default CourseItem