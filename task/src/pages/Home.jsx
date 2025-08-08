import React, { useState } from 'react';
import ARViewer from '../components/ARViewer';

const Index = () => {
  const [isARActive, setIsARActive] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);

  const handleARClose = () => {
    setIsARActive(false);
  };

  const handleCTAClick = (action) => {
    // Add CTA logic if needed
    setTimeout(() => handleARClose(), 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <ARViewer 
        isActive={isARActive} 
        onClose={handleARClose} 
        onCTAClick={handleCTAClick} 
      />
    </div>
  );
};

export default Index;
