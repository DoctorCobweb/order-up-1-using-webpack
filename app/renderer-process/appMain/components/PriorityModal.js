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
        <div>

          <div
            className={
              (props.priorities['1'] && props.priorities['1'] !== props.prioritisingOrderId)
              ? 
              "button button--grey"
              :
                props.priorities['1'] === props.prioritisingOrderId
                ?
                "button button--green"
                :
                "button"
            }
            onClick={ () => props.handleSelectPriority('1') }
          >
            1
          </div>
          <div
            className={
              (props.priorities['2'] && props.priorities['2'] !== props.prioritisingOrderId)
              ? 
              "button button--grey"
              :
                props.priorities['2'] === props.prioritisingOrderId
                ?
                "button button--green"
                :
                "button"
            }
            onClick={ () => props.handleSelectPriority('2') }
          >
            2
          </div>
          <div
            className={
              (props.priorities['3'] && props.priorities['3'] !== props.prioritisingOrderId)
              ? 
              "button button--grey"
              :
                props.priorities['3'] === props.prioritisingOrderId
                ?
                "button button--green"
                :
                "button"
            }
            onClick={ () => props.handleSelectPriority('3') }
          >
            3
          </div>
          <div
            className={
              (props.priorities['4'] && props.priorities['4'] !== props.prioritisingOrderId)
              ? 
              "button button--grey"
              :
                props.priorities['4'] === props.prioritisingOrderId
                ?
                "button button--green"
                :
                "button"
            }
            onClick={ () => props.handleSelectPriority('4') }
          >
            4
          </div>
          <div
            className={
              (props.priorities['5'] && props.priorities['5'] !== props.prioritisingOrderId)
              ? 
              "button button--grey"
              :
                props.priorities['5'] === props.prioritisingOrderId
                ?
                "button button--green"
                :
                "button"
            }
            onClick={ () => props.handleSelectPriority('5') }
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
    </div>
  </Modal>
)

const mapStateToProps = (state) => ({
  priorities: state.priorities,
})

export default connect(mapStateToProps, null)(PriorityModal)