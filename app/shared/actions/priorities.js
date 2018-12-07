import { Priorities } from '../models/priorities'
import uuidv1 from 'uuid/v1' // timestamp (UTC) version of uuid


const NUMBER_OF_PRIORITIES_INSTANCES = 1


const getThePrioritiesInMongo = () => {
  return Priorities.findOne({})
  .then(prioritiesDoc => {
    return prioritiesDoc.toJSON()
  })
  .catch(err => {
    throw err
  })
}

const createThePrioritiesInMongo = () => {
  const newPriorities = new Priorities({
    _id: uuidv1(), 
    priorities: {
      'first': '',
      'second': '',
      'third': '',
      'fourth': '',
      'fifth': '',
    }
  })
  return newPriorities.save()
    .then(newPriorities => {
      return newPriorities.toJSON()
    })
    .catch(err => {
      throw err
    })
}

export const setupPriorities = (prioritiesData) => ({
  type: 'SETUP_PRIORITIES',
  payload: {
    prioritiesData,
  }
})

export const startSetupPriorities = () => {
  return (dispatch, getState) => {
    return Priorities.countDocuments().exec()
      .then(count => {
        // there is only 1 priority instance for the entire OrderUp app
        if (count === NUMBER_OF_PRIORITIES_INSTANCES) {
          console.log('only 1 priorities instance')
          return getThePrioritiesInMongo()
        } else {
          console.log('no priorities instance')
          return createThePrioritiesInMongo()
        }
      })
      .then(prioritiesData => {
        console.log('prioritiesData')
        console.log(prioritiesData)
        dispatch(setupPriorities(prioritiesData))
      })
      .catch(err => {
        throw err
      })
  }
}

export const  deletePriorities = () => ({
  type: 'DELETE_PRIORITIES',
  payload: {}
})

export const startDeletePriorities = () => {
  return (dispatch, getState) => {
    return Priorities.deleteMany({}).exec()
      .then(() => {
        return dispatch(deletePriorities())
      })
      .catch(() => {
        throw err
      })
  }
}



// export const assignAPriorityToOrder = (orderId, priority) => ({
//   type: 'ASSIGN_A_PRIORITY_TO_ORDER',
//   payload: {
//     orderId,
//     priority,
//   },
// })

// export const startAssignAPriorityToOrder = ({ orderId, priority }) => {
//   return (dispatch, getState) => {
//     // NOTE: from thunk: getState() gives you access to the entire state,
//     // not just this slice of state.
//     //
//     // algo:
//     // find order
//     // update its priorityNumber
//     // call dispatch assignAPriorityToOrder
//   }
// }