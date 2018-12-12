import React from 'react'
import Header from '../../../renderer-process/appMain/components/Header'
import AddOrderForm from './AddOrderForm'

export default class AddNewOrder extends React.Component {
  render = () => (
    <div>
      <Header/>
      <AddOrderForm />
    </div>
  )
}

// AIM: CONSTRUCT AN ORDER IN THIS FORM.
// then insert into db like usual
// {
//   "metaData": {
//     "orderTakenUsing": "TABLET 2",
//     "clerk": "BORAT",
//     "orderSentAt": "15/10/2018 22:10:17",
//     "variableContent": ["PRINT A/C - SARAH @ 11:04"],
//     "tableNumber": "3",
//     "customerName": "WISELY",
//     "covers": "20",
//     "location": "JUKE BAR",
//     "goOnMains": false
//   },
//   "meals": {
//     "ENTREES DINNER": [
//       {
//         "quantity": 2,
//         "name": "CHILDS FISH",
//         "info": [
//           [
//             {"quantity": 1, "info": "EX CHEESE"},
//             {"quantity": 1, "info": "NO PEPPER"},
//             {"quantity": 1, "info": "ADD JALEPENOS"}
//           ]
//         ]
//       },
//       {"quantity": 4, "name": "BRUSCHETTA", "info": []}
//     ],
//     "MAINS DINNER": [
//       {"quantity": 1, "name": "WEDGES", "info": []},
//       {
//         "quantity": 3,
//         "name": "BEEF BURGER",
//         "info": [
//           [
//             {"quantity": 1, "info": "MED RARE"},
//             {"quantity": 1, "info": "MUSH"},
//             {"quantity": 1, "info": "CHIPS GREENS"},
//             {"quantity": 1, "info": "XTRA GARLIC BUTT"}
//           ]
//         ]
//       }
//     ],
//     "DESSERT": [
//       {"quantity": 1, "name": "SENIOR PUDDING", "info": []},
//       {
//         "quantity": 3,
//         "name": "CARAMEL TOPPING",
//         "info": [
//           [
//             {"quantity": 1, "info": "WITH SORBET INSTEAD"},
//             {"quantity": 1, "info": "EX COLD"},
//             {"quantity": 1, "info": "SPRINKLES O/S"}
//           ],
//           [
//             {"quantity": 1, "info": "LEMON SCE"},
//             {"quantity": 1, "info": "EX SCOOP"}
//           ]
//         ]
//       }
//     ]
//   }
// }