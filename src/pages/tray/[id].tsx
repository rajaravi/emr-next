import { useRouter } from 'next/router';
import React from 'react';

const TrayItem = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Tray Item {id}</h1>
      {/* Specific tray item content goes here */}
    </div>
  );
};

export default TrayItem;
