// components/ToastNotification.tsx
import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { ToastPosition } from 'react-bootstrap/esm/ToastContainer';

interface ToastNotificationProps {
  show: boolean;
  message: string;
  position?: ToastPosition | undefined;
  onClose: () => void;
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ show, message, position, onClose, color = 'primary' }) => {
  return (
    <ToastContainer position={position} className="p-3">
      <Toast className="d-inline-block m-1" bg={color} onClose={onClose} show={show} delay={3000} autohide>
        <Toast.Header className={`bg-${color} text-white`}>
          <strong className="me-auto">Notification</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body className={`bg-${color} text-white`}>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
