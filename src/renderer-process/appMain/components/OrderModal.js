import React from 'react'
import Modal from 'react-modal'
import { connect } from 'react-redux'
import Order from './Order'

const OrderModal = (props) => (
  <Modal
    isOpen={!!props.selectedOrder}
    // for when user presses 'esc' or clicks background to close modal:
    onRequestClose={props.handleClearSelectedOrder}
    contentLabel="Selected Order"
    // closeTimeoutMS={200}
    className="modal"
    ariaHideApp={false} // see https://github.com/reactjs/react-modal/tree/master/docs/accessibility
  >
    <div>
    { !!props.selectedOrder && <Order order={props.selectedOrder}/>}
    <p>TODO: other stuff</p>
    <p>FORM STUFF</p>
    </div>
  </Modal>

) 

// USE SELECTOR to get the order corresponding to selectedOption
// const mapStateToProps = (state) => ({
//   orders: state
// })

// export default connect(mapStateToProps, null)(OrderModal)
export default OrderModal
