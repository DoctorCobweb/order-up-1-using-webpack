import React from 'react'
import uuidv1 from 'uuid/v1'

const makeASingleInfoLine = (line) => (
  <div key={ line._id }>
    <div>{ line.quantity } { line.name }</div>
  </div>
)

const CourseItemInfo = (props) => (
    <div key={props.infoId} className="item-info">
      { props.info.infoLines.map(makeASingleInfoLine) } 
      <div>------------</div>
    </div>
)

export default CourseItemInfo