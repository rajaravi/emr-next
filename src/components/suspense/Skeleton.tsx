import React from 'react';
import styles from './Skeleton.module.css'; // Optional for styling

const Skeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeleton} />
      <div className={styles.skeleton} />
      <div className={styles.skeleton} />
    </div>
  );
};

export default Skeleton;
