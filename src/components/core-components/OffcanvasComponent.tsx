// components/OffcanvasComponent.tsx
import React from 'react';
import { Offcanvas, Button } from 'react-bootstrap';

interface OffcanvasComponentProps {
  show: boolean;
  title: string;
  handleClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

const OffcanvasComponent: React.FC<OffcanvasComponentProps> = ({ show, title, handleClose, onSave, children }) => {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{title}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {children}
      </Offcanvas.Body>
      {/* Footer with Save and Close buttons */}
      <div className="offcanvas-footer d-flex justify-content-end p-3 border-top">
        <Button variant="secondary" onClick={handleClose} className="me-2">
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save
        </Button>
      </div>
    </Offcanvas>
  );
};

export default OffcanvasComponent;
