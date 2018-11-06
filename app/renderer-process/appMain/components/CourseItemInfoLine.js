import React from 'react'

const CourseItemInfoLine = (props) => (
  <div>
    {/* <button onClick={ props.onItemInfoLineClick }>{ props.line.quantity } { props.line.name }</button> */}
    <input 
      onChange={ (e) => props.handleItemInfoLineClick(e, props.infoId, props.line._id) }
      onFocus={ (e) => props.handleItemInfoLineClick(e, props.infoId, props.line._id) }
      onKeyDown={ (e) => props.handleItemInfoLineKeyDown(e, props.infoId, props.line._id) }
      value={ 
        props.isUpdating ?
        props.editingLineContent
        :
        `${props.line.quantity} ${props.line.name}` }
    />
  </div>
)

export default CourseItemInfoLine

