import React from 'react';
import { Spinner } from 'react-bootstrap';
import styles from './_style.module.css';


interface GlobalSpinnerProps {
  show: boolean;
}

const GlobalSpinner: React.FC<GlobalSpinnerProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <Spinner animation="border" role="status" className={styles.spinner}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default GlobalSpinner;
