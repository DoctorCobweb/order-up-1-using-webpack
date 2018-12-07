import React from 'react'
import { connect } from 'react-redux'
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
            (props.priorities.first && props.priorities.first !== props.prioritisingOrderId)
            ? 
            "button button--grey"
            :
              props.priorities.first === props.prioritisingOrderId
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
            (props.priorities.second && props.priorities.second !== props.prioritisingOrderId)
            ? 
            "button button--grey"
            :
              props.priorities.second === props.prioritisingOrderId
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
            (props.priorities.third && props.priorities.third !== props.prioritisingOrderId)
            ? 
            "button button--grey"
            :
              props.priorities.third === props.prioritisingOrderId
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
            (props.priorities.fourth && props.priorities.fourth !== props.prioritisingOrderId)
            ? 
            "button button--grey"
            :
              props.priorities.fourth === props.prioritisingOrderId
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
            (props.priorities.fifth && props.priorities.fifth !== props.prioritisingOrderId)
            ? 
            "button button--grey"
            :
              props.priorities.fifth === props.prioritisingOrderId
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
            !_.values(props.priorities).includes(props.prioritisingOrderId) ?
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

const mapStateToProps = (state) => ({
  priorities: state.priorities,
})

export default connect(mapStateToProps, null)(PriorityModal)