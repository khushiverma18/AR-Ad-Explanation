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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${isMarkerDetected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-muted-foreground">
                {isMarkerDetected ? 'Marker Detected - Content Playing' : 'Searching for AR Marker...'}
              </span>
              {isContentPlaying && (
                <div className="flex items-center space-x-1 text-green-500">
                  <Play className="w-3 h-3" />
                  <span className="text-xs">LIVE</span>
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="w-full h-80 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-lg border-2 border-primary/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-600/20 via-transparent to-gray-900/30">
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='m0 40 40-40v40z'/%3E%3C/g%3E%3C/svg%3E\")"
                }}></div>
              </div>

              <div ref={mountRef} className="absolute inset-0 flex items-center justify-center">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="text-center space-y-2">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-sm text-white">Initializing AR Camera...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-primary/80"></div>
                <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-primary/80"></div>
                <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-primary/80"></div>
                <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-primary/80"></div>

                {!isMarkerDetected && (
                  <div className="absolute inset-0">
                    <div className="absolute inset-x-0 top-1/3 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-pulse"></div>
                    <div className="absolute inset-x-0 top-2/3 h-0.5 bg-gradient-to-r from-transparent via-secondary/60 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                )}

                {isMarkerDetected && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <div className="flex items-center space-x-2 text-white text-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>AR Target Locked</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2 text-white text-sm">
                <Camera className="w-4 h-4 text-primary" />
                <span>AR Camera</span>
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              {isMarkerDetected
                ? "🎯 Keep the marker in view to continue the AR experience"
                : "📱 Point your camera at a flat surface (table, paper, laptop screen) to see AR content"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onCTAClick('buy')}
              className="flex items-center space-x-2"
              variant="ar"
              disabled={!isMarkerDetected}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buy Now</span>
            </Button>
            <Button
              onClick={() => onCTAClick('info')}
              variant="outline"
              className="flex items-center space-x-2"
              disabled={!isMarkerDetected}
            >
              <Info className="w-4 h-4" />
              <span>Learn More</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ARViewer;
