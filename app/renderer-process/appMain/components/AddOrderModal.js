import React from 'react'
import Modal from 'react-modal'
import AddOrderForm from './AddOrderForm'

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

const AddOrderModal = (props) => {
  return (
    <Modal
      isOpen={ props.isAddingNewOrder }
      // for when user presses 'esc' or clicks background to close modal:
      onRequestClose={ props.handleCancelAddNewOrder } 
      contentLabel="Add New Order"
      // closeTimeoutMS={200}
      className="modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)'
        }
      }}
    >
      <div className="add-order-modal__container">
        <button className="button" onClick={ props.handleCancelAddNewOrder }>X</button>
        <h1>Add New Order</h1>
        <AddOrderForm />
      </div>
    </Modal>
  )
}

export default AddOrderModal 
