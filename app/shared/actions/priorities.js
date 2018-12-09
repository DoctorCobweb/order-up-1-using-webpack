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
      '1': '',
      '2': '',
      '3': '',
      '4': '',
      '5': '',
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

export const setupPriorities = (priorities) => ({
  type: 'SETUP_PRIORITIES',
  payload: {
    priorities,
  }
})

export const startSetupPriorities = () => {
  return (dispatch, getState) => {
    return Priorities.countDocuments().exec()
      .then(count => {
        // there is only 1 priority instance for the entire OrderUp app
        if (count === NUMBER_OF_PRIORITIES_INSTANCES) {
          return getThePrioritiesInMongo()
        } else {
          return createThePrioritiesInMongo()
        }
      })
      .then(prioritiesData => {
        return dispatch(setupPriorities(prioritiesData.priorities))
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

export const setPriority = (priorities) => ({
  type: 'SET_PRIORITY',
  payload: {
    priorities,
  }
})

export const startSetPriority = ({ priority, prioritisingOrderId }) => {
  return (dispatch, getState) => {
    return Priorities.findOne({})
      .then(prioritiesDoc => {

        if (priority === 'none') {
          prioritiesDoc.priorities.forEach((val, key, map) => {
            if (val === prioritisingOrderId) {
              prioritiesDoc.priorities.set(key, '')
            }
          })
        } else {

          // check if the orderId is already present as a priority.
          // if it is, then clear it out.
          // then update priorites with the new priority for the order
          prioritiesDoc.priorities.forEach((val, key, map) => {
            if (val === prioritisingOrderId) {
              prioritiesDoc.priorities.set(key, '')
              return
            }

            if (key === priority) {
              prioritiesDoc.priorities.set(key, prioritisingOrderId)
              return
            }
          })
        }

        return prioritiesDoc.save()
      })
      .then(prioritiesDoc => {
        return dispatch(setPriority(prioritiesDoc.priorities.toJSON()))
      })
      .catch(err => {
        throw err
      })
  }
}

export const removeOrderFromPriorities = (priorities) => ({
  type: 'REMOVE_ORDER_FROM_PRIORITIES',
  payload: {
    priorities,
  }
})

export const startRemoveOrderFromPriorities = ({ orderId }) => {
  return (dispatch, getState) => {
    return Priorities.findOne().exec()
    .then(priorities => {
      priorities.priorities.forEach((val, key, map)=> {
        if (val === orderId) {
          priorities.priorities.set(key, '')
        }
      })
      return priorities.save()
    })
    .then(priorities => {
      return dispatch(removeOrderFromPriorities(priorities.toJSON()))
    })
    .catch(err => {
      throw err
    })
  }
}