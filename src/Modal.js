import React from "react"
import ReactDom from "react-dom"
const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#121212',
    padding: '50px',
    zIndex: 1000,
}

export default function Modal({open, children, onClose,}) {
    if (!open) return null

    return ReactDom.createPortal(
        (<>
        <div className="background"></div>
        <div style={MODAL_STYLES} className="portal">
            {children}
        </div>
        </>), document.getElementById("portal")
    )
}