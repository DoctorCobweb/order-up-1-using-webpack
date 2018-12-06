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
        yadda: TODO: be able to choose what priority the order should be.
        <div
          onClick={ () => props.handleSelectPriority({priority: 1})}
        >
          1
        </div>
        <div
          onClick={ () => props.handleSelectPriority({priority: 2})}
        >
          2
        </div>
        <div
          onClick={ () => props.handleSelectPriority({priority: 3})}
        >
          3
        </div>
        <div
          onClick={ () => props.handleSelectPriority({priority: 4})}
        >
          4
        </div>
        <div
          onClick={ () => props.handleSelectPriority({priority: 5})}
        >
          5
        </div>
      </div>
    </div>
  </Modal>
)

export default PriorityModal
