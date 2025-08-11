import React, { useEffect, useState, useRef } from "react";

export default function ARViewer() {
  const [markerVisible, setMarkerVisible] = useState(false);
  const videoRef = useRef(null);
  const webcamRef = useRef(null);

  // Start webcam
  useEffect(() => {
    async function startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Webcam error:", err);
      }
    }
    startWebcam();
  }, []);

  // This is just a manual toggle button to simulate marker detection for demo
  const toggleMarker = () => {
    setMarkerVisible(prev => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-xl mb-4">AR Experience (Demo)</h1>

      {/* Webcam preview */}
      <video
        ref={webcamRef}
        autoPlay
        muted
        playsInline
        className="w-[320px] h-[240px] rounded-lg border border-gray-600 mb-4"
      />

      {!markerVisible ? (
        <div className="text-gray-400 mb-4">📷 Point your camera at the target image</div>
      ) : (
        <div className="w-[320px] h-[180px] bg-gray-800 flex items-center justify-center mb-4">
          <video
            ref={videoRef}
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <button
        onClick={toggleMarker}
        className="mb-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
      >
        {markerVisible ? "Simulate Marker Lost" : "Simulate Marker Found"}
      </button>

      <a
        href="#"
        className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
      >
        Buy Now
      </a>
    </div>
  );
}
