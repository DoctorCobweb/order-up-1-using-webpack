import React from 'react'
import Modal from 'react-modal'

export const WarningModal = (props) => (
  <Modal
    isOpen={ props.displayWarningModal}
    // for when user presses 'esc' or clicks background to close modal:
    onRequestClose={ props.handleCancelDeleteAllOrdersClick }
    contentLabel="Delete All Orders"
    // closeTimeoutMS={200}
    className="modal"
    style={{
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
      },
      content: {
        height: '30rem',
        width: '40rem',
      }
    }}
  >
    <div className="warning-modal__container">
      <h1>Are you sure you want to delete all orders?</h1>
      <h3 className="warning">There is NO UNDO option if you click 'Yes'</h3>
      <div className="warning-modal__button-container">
        <button
          className="button button--grey"
          onClick={ props.handleCancelDeleteAllOrdersClick }
        >
          Cancel 
        </button>
        <button
          className="button button--red"
          onClick={ props.handleConfirmDeleteAllOrdersClick }
        >
          Delete All Orders
        </button>
      </div>
    </div>
  </Modal>
)

export default WarningModal