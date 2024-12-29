// components/Toast.js
import { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


interface ToastProps {
    message: React.ReactNode;
    color: string;
    show: boolean;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, color, show, onClose  }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    const bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min.js');
    if (toastRef.current) {
      const bsToast = new bootstrap.Toast(toastRef.current, {
        autohide: true,
        delay: 3000, // Adjust delay as needed
      });
      if (show) {
        bsToast.show();
      } else {
        bsToast.hide();
      }
    }
  }, [show, onClose]);

  return (
    <div  ref={toastRef} className={`toast position-fixed top-40 start-50 translate-middle-x border-0 ${color}`} role="alert" aria-live="assertive" aria-atomic="true" style={{ zIndex: 11 }}>
        <div className="d-flex">
            <div className="toast-body">{message}</div>
            <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={onClose}
                ></button>           
        </div>
    </div>    
  );
};

export default Toast;
