import React from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#root')

const PriorityModal = (props) => (
  <Modal
    isOpen={ props.isPrioritisingOrder }
    // for when user presses 'esc' or clicks background to close modal:
    onRequestClose={ props.handleClearPrioritiseOrder }
    contentLabel="Prioritise Order"
    // closeTimeoutMS={200}
    className="modal"
    style={{
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
      }
    }}
  >
    <div className="">
      <button
        className="button button--header"
        onClick={ props.handleClearPrioritiseOrder }
      >
        X
      </button>
      <div>
        <h1>Order Priority</h1>
        <div>{ props.prioritisingOrderId }</div>
        <div
          className={
            (props.prioritisedOrders.first && props.prioritisedOrders.first !== props.prioritisingOrderId)
            ? 
            "button button--grey"
            :
              props.prioritisedOrders.first === props.prioritisingOrderId
              ?
              "button button--green"
              :
              "button"
          }
          onClick={ () => props.handleSelectPriority('first') }
        >
          1
        </div>
        <div
          className={
            (props.prioritisedOrders.second && props.prioritisedOrders.second !== props.prioritisingOrderId)
            ? 
            "button button--grey"
            :
              props.prioritisedOrders.second === props.prioritisingOrderId
              ?
              "button button--green"
              :
              "button"
          }
          onClick={ () => props.handleSelectPriority('second') }
        >
          2
        </div>
        <div
          className={
            (props.prioritisedOrders.third && props.prioritisedOrders.third !== props.prioritisingOrderId)
            ? 
            "button button--grey"
            :
              props.prioritisedOrders.third === props.prioritisingOrderId
              ?
              "button button--green"
              :
              "button"
          }
          onClick={ () => props.handleSelectPriority('third') }
        >
          3
        </div>
        <div
          className={
            (props.prioritisedOrders.fourth && props.prioritisedOrders.fourth !== props.prioritisingOrderId)
            ? 
            "button button--grey"
            :
              props.prioritisedOrders.fourth === props.prioritisingOrderId
              ?
              "button button--green"
              :
              "button"
          }
          onClick={ () => props.handleSelectPriority('fourth') }
        >
          4
        </div>
        <div
          className={
            (props.prioritisedOrders.fifth && props.prioritisedOrders.fifth !== props.prioritisingOrderId)
            ? 
            "button button--grey"
            :
              props.prioritisedOrders.fifth === props.prioritisingOrderId
              ?
              "button button--green"
              :
              "button"
          }
          onClick={ () => props.handleSelectPriority('fifth') }
        >
          5
        </div>
        <div
          className={
            !_.values(props.prioritisedOrders).includes(props.prioritisingOrderId) ?
             "button button--green"
             :
             "button"
          }
          onClick={ () => props.handleSelectPriority('none') }
        >
          None
        </div>
      </div>
    </div>
  </Modal>
)

export default PriorityModal
