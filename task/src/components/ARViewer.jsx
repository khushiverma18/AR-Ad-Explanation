import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";

const ARContent = () => {
  return (
    <>
      <ambientLight />
      <directionalLight position={[0, 5, 5]} />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  );
};

const ARViewer = () => {
  const [markerVisible, setMarkerVisible] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    const detectMarker = () => {
      // Simulated marker detection
      const isDetected = Math.random() > 0.5;
      setMarkerVisible(isDetected);
    };

    const interval = setInterval(detectMarker, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Optional: Simulated camera feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Show AR content only when marker is visible */}
      {markerVisible && (
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ARContent />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
      )}

      {/* Marker detection status */}
      <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded">
        Marker: {markerVisible ? "Visible ✅" : "Not Detected ❌"}
      </div>
    </div>
  );
};

export default ARViewer;
