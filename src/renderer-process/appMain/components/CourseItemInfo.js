import React from 'react'
import uuidv1 from 'uuid/v1'

const makeASingleInfoLine = (info) => (
  <div key={ uuidv1() }>
    <div>{ info.quantity } { info.info }</div>
  </div>
)

const CourseItemInfo = (props) => (
    <div key={uuidv1()} className="item-info">
      { props.itemInfo.itemInfo.map(makeASingleInfoLine) } 
      <div>------------</div>
    </div>
)

export default CourseItemInfo