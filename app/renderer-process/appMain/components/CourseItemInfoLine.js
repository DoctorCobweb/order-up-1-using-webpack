import React from 'react'

const CourseItemInfoLine = (props) => (
  <div>
    {/* <button onClick={ props.onItemInfoLineClick }>{ props.line.quantity } { props.line.name }</button> */}
    <textarea 
      onChange={ (e) => props.handleItemInfoLineClick(e, props.infoId) }
      onFocus={ (e) => props.handleItemInfoLineClick(e, props.infoId) }
      onKeyDown={ props.handleItemInfoLineKeyDown }
      value={ `${props.line.quantity} ${props.line.name}` }
    />
  </div>
)

export default CourseItemInfoLine

