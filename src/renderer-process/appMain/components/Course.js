import React from 'react'
import uuidv1 from 'uuid/v1'

export default class Course extends React.Component {

  handleEachCourseItem = (item) => (
    <div key={ uuidv1() }>
      <h4>{ item.quantity } { item.name }</h4>
      { item.info.length !== 0 && item.info.map(this.handleEachItemInfo) }
    </div>
  )

  handleEachItemInfo = (itemInfo) => (
    <div key={ uuidv1() }>
      { itemInfo.itemInfo.map(this.makeInfoLine) } 
      <div>------------</div>
    </div>
  )

  makeInfoLine = (info) => (
    <div key={ uuidv1() }>
      <div>{ info.quantity } { info.info }</div>
    </div>
  )

  render = () => (
    <div>
      <h2>{ this.props.courseName }</h2>
      { this.props.courseItems.map(this.handleEachCourseItem) }
    </div>
  )
}

//   render() {
//     return (
//       <div>
//         <h2>{ this.props.courseName }</h2>
//         { this.props.courseItems
//             .map(item => (
//               <div key={ `${item.quantity}_${item.name}_${uuidv1()}`}>
//                 <h4>{ item.quantity } {item.name}</h4>
//                 { item.info.length !== 0
//                     &&
//                   item.info
//                     .map((itemInfo) => {
//                       return (
//                         <div key={uuidv1()}>
//                           {itemInfo.itemInfo.map(info => {
//                             return (
//                               <div>
//                                 <div>{info.quantity} {info.info}</div>
//                               </div>
//                             )
//                           })
//                           } 
//                           <div>------------</div>
//                         </div>
//                       )
//                     }) 
//                 }
//               </div>
//             )
//           )
//         }
//       </div>
//     )
//   }
// }