import React from 'react'
import Modal from 'react-modal'
import Order from './Order'

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

const OrderModal = (props) => {
  return (
    <Modal
      isOpen={ !!props.selectedOrderId }
      // for when user presses 'esc' or clicks background to close modal:
      onRequestClose={ props.handleClearSelectedOrder }
      contentLabel="Selected Order"
      // closeTimeoutMS={200}
      className="modal"
    >
      <div>
        <button className="button" onClick={ props.handleClearSelectedOrder }>X</button>
        { !!props.selectedOrderId
          && 
          <Order 
            key={ props.selectedOrderId }
            orderId={ props.selectedOrderId }
          /> 
        }
      </div>
    </Modal>
  )
}

export default OrderModal
