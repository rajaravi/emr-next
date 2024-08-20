import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './_style.module.css';

interface ModalPopUpProps {
    show: boolean;
    handleClose: () => void;
    title: string;
    sizeElement: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const ModalPopUp: React.FC<ModalPopUpProps> = ({ show, handleClose, title, children, footer, sizeElement }) => {

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <>
            <div
                className={`modal fade ${show ? 'show' : ''}`}
                tabIndex={-1}
                style={{ display: show ? 'block' : 'none' }}
                aria-hidden={!show}
                onClick={handleBackdropClick}
            >
                <div className={`modal-dialog ${sizeElement}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" style={{ flex: 1 }}>{title}</h5>
                            <div>
                                {footer ? (
                                    footer
                                ) : (
                                    <>
                                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                                        <button type="button" className="btn btn-primary">Save changes</button>
                                    </>
                                )}
                            </div>
                            {/* <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button> */}
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            {show && (
                <div
                    className="modal-backdrop fade show"
                    style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1040 }}
                    onClick={handleClose}
                ></div>
            )}
        </>
    );
};

export default ModalPopUp;
