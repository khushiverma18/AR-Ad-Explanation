import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { X, Camera, ShoppingCart, Info, Play } from 'lucide-react';

const ARViewer = ({ isActive, onClose, onCTAClick }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isMarkerDetected, setIsMarkerDetected] = useState(false);
  const [isContentPlaying, setIsContentPlaying] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const detectionInterval = setInterval(() => {
      const shouldDetect = Math.random() > 0.3;
      setIsMarkerDetected(shouldDetect);
      setIsContentPlaying(shouldDetect);
    }, 2000);

    return () => clearInterval(detectionInterval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1.2, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(480, 400);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00ff88, 1.2);
    directionalLight.position.set(3, 3, 5);
    scene.add(directionalLight);

    const laptopGroup = new THREE.Group();

    const baseGeometry = new THREE.BoxGeometry(2, 0.1, 1.4);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const laptopBase = new THREE.Mesh(baseGeometry, baseMaterial);
    laptopBase.position.y = -0.5;
    laptopGroup.add(laptopBase);

    const screenGeometry = new THREE.BoxGeometry(1.8, 1.2, 0.05);
    const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const laptopScreen = new THREE.Mesh(screenGeometry, screenMaterial);
    laptopScreen.position.set(0, 0.1, -0.65);
    laptopScreen.rotation.x = -0.1;
    laptopGroup.add(laptopScreen);

    const videoGeometry = new THREE.PlaneGeometry(1.6, 1.0);
    const videoMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.9
    });
    const videoPlane = new THREE.Mesh(videoGeometry, videoMaterial);
    videoPlane.position.set(0, 0.1, -0.62);
    videoPlane.rotation.x = -0.1;
    laptopGroup.add(videoPlane);

    const holoRing = new THREE.RingGeometry(1.5, 1.7, 32);
    const holoMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const holoEffect = new THREE.Mesh(holoRing, holoMaterial);
    holoEffect.rotation.x = -Math.PI / 2;
    holoEffect.position.y = -0.6;
    laptopGroup.add(holoEffect);

    scene.add(laptopGroup);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 6;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ff88,
      size: 0.03,
      transparent: true,
      opacity: 0.7
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.set(0, 0.5, 3);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (isMarkerDetected && isContentPlaying) {
        laptopGroup.rotation.y += 0.005;
        holoEffect.rotation.z += 0.02;
        videoPlane.material.opacity = 0.9 + Math.sin(Date.now() * 0.003) * 0.1;

        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(Date.now() * 0.002 + positions[i]) * 0.001;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        laptopGroup.visible = true;
        particles.visible = true;
      } else {
        laptopGroup.visible = false;
        particles.visible = false;
      }

      renderer.render(scene, camera);
    };

    setTimeout(() => {
      setIsLoading(false);
      animate();
    }, 1000);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isActive, isMarkerDetected, isContentPlaying]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-primary/20">
        <CardContent className="p-6">
          {/* UI elements remain unchanged */}
          {/* This section contains the AR scene canvas and detection feedback */}
          <div ref={mountRef} className="relative h-80 w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ARViewer;
