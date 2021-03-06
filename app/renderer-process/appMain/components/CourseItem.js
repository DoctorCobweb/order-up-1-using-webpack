import React from 'react'

const CourseItem = (props) => (
  <div className={ props.quantity <= 0 ? "course-item course-item-completed" : "course-item" } >
    <div className="course-item__container">
      <div className="course-item__quantity">{ props.quantity }</div>
      <div className="course-item__name">{ props.name }</div>
    </div>
    <div className="button__stack">
      <button className="button-button__stack" onClick={ () => props.handleItemQuantityClick(1) }>+</button>
      <button className="button-button__stack" onClick={ () => props.handleItemQuantityClick(-1) } >-</button>
    </div>
  </div>
)

export default CourseItem