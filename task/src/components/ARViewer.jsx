import React, { useState, useEffect } from "react";

export default function ARViewer() {
  const [markerVisible, setMarkerVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate marker detection toggle every 5 seconds
      setMarkerVisible(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-xl mb-4">AR Experience</h1>

      {!markerVisible ? (
        <div className="text-gray-400">📷 Point your camera at the target image</div>
      ) : (
        <div className="w-[300px] h-[200px] bg-gray-800 flex items-center justify-center">
          <video
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          ></video>
        </div>
      )}

      <a
        href="#"
        className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
      >
        Buy Now
      </a>
    </div>
  );
}
