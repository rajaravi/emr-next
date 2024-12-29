import React from 'react';
import styles from './FormSkeleton.module.css';

const FormSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      {Array(4).fill(0).map((_, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          <div className={styles.skeletonField} />
          <div className={styles.skeletonField} />
          <div className={styles.skeletonField} />
          <div className={styles.skeletonField} />
        </div>
      ))}
    </div>
  );
};

export default FormSkeleton;
