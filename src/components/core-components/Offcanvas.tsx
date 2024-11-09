import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface OffcanvasProps {
  title: string;
  size: string;
  children: React.ReactNode;
  show: boolean;
  onClose: () => void;
  action: React.ReactNode;  
}

const Offcanvas: React.FC<OffcanvasProps> = ({ title, size, children, show, onClose, action }) => {
  
  useEffect(() => {
    // Dynamically import Bootstrap JS for client-side only
    const bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min.js');
    
    var offcanvasElement = document.getElementById('offcanvasComponent');
    
    if (offcanvasElement) {
      var offcanvas = new bootstrap.Offcanvas(offcanvasElement);
      // Open or close offcanvas based on `show` prop
      if (show) {        
        offcanvas.show();
      } else {      
        offcanvas.hide();
        offcanvasElement.classList.remove('show');
        // offcanvasElement.setAttribute('aria-hidden', 'true');
        // document.body.classList.remove('offcanvas-backdrop');
        const backdrop = document.querySelector('.offcanvas-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
      }
      // // Close the offcanvas when the component unmounts
      // const handleHidden = () => onClose();
      // offcanvasElement.addEventListener('hidden.bs.offcanvas', handleHidden);

      // // Cleanup event listener on unmount
      // return () => {
      //   offcanvasElement.removeEventListener('hidden.bs.offcanvas', handleHidden);
      // };
    }
  }, [show, onClose]);

  return (
    <div className={`offcanvas ${size} offcanvas-end`} tabIndex={-1} id="offcanvasComponent" aria-labelledby="offcanvasComponentLabel" data-bs-backdrop="static">      
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasComponentLabel">{title}</h5>       
          {action}   
          <button
            type="button"
            className="btn-close text-reset ms-2"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
        <div className="offcanvas-body">          
            {children} 
        </div>      
    </div>
  );
};

export default Offcanvas;
