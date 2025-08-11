import React, { useState } from 'react';
import ARViewer from '../components/ARViewer';

const Index = () => {
  const [isARActive, setIsARActive] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);

  const handleARClose = () => {
    setIsARActive(false);
  };

  const handleCTAClick = (action) => {
    // Optional: Do something with the action
    console.log('CTA clicked:', action);
    // Close AR after a short delay
    setTimeout(() => handleARClose(), 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {isARActive ? (
        <ARViewer
          isActive={isARActive}
          onClose={handleARClose}
          onCTAClick={handleCTAClick}
        />
      ) : (
        <div className="text-center text-gray-400">
          <p>AR session ended.</p>
          <button
            onClick={() => setIsARActive(true)}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            Restart AR
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
