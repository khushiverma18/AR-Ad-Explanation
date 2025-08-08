import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ARViewer = () => {
  const mountRef = useRef(null);
  const [markerDetected, setMarkerDetected] = useState(false);

  useEffect(() => {
    if (!markerDetected) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Cube geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(ambientLight, directionalLight);

    // Animation loop
    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [markerDetected]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Fake camera background */}
      {!markerDetected && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `url('https://i.ibb.co/zP8sN6W/camera-bg.jpg') center center / cover no-repeat`,
            zIndex: 1,
          }}
        />
      )}

      {/* Three.js canvas */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          zIndex: 2,
          position: 'relative',
        }}
      />

      {/* Scan/Detect button */}
      {!markerDetected && (
        <button
          onClick={() => setMarkerDetected(true)}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 3,
            padding: '12px 20px',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Simulate QR Scan
        </button>
      )}
    </div>
  );
};

export default ARViewer;
