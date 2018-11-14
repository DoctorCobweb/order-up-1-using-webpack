import { Order, Course, Item, Info, InfoLine } from '../models/order'
import stringify from 'json-stringify-pretty-compact'
import colors from 'colors'
import uuidv1 from 'uuid/v1' // timestamp (UTC) version of uuid

export const setupLists = () => ({
  type: 'SETUP_LISTS',
  payload: {}
})

// TODO: incorporate Mongodb for persistence
export const startSetupLists = () => {
  return (dispatch, getState) => {
    dispatch(setupLists())
  }
}

export const updateLists = (data) => ({
  type: 'UPDATE_LISTS',
  payload: data
})

// TODO: incorporate Mongodb for persistence
export const startUpdateLists = (data) => {
  return (dispatch, getState) => {
    dispatch(updateLists(data))
  }
}

