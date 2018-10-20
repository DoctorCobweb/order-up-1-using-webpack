import React from 'react'
import Modal from 'react-modal'
import { connect } from 'react-redux'
import Order from './Order'

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

const OrderModal = (props) => (
  <Modal
    isOpen={ !!props.selectedOrder }
    // for when user presses 'esc' or clicks background to close modal:
    onRequestClose={ props.handleClearSelectedOrder }
    contentLabel="Selected Order"
    // closeTimeoutMS={200}
    className="modal"
  >
    <div>
      <button className="button" onClick={ props.handleClearSelectedOrder }>X</button>
      { !!props.selectedOrder && <Order order={ props.selectedOrder }/> }
    </div>
  </Modal>
) 

// USE SELECTOR to get the order corresponding to selectedOption
// const mapStateToProps = (state) => ({
//   orders: state
// })

// export default connect(mapStateToProps, null)(OrderModal)
export default OrderModal
