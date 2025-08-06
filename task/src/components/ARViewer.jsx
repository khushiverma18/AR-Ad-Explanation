import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ShoppingCart, Info, X } from 'lucide-react';

export default function ARViewer({ isActive, onClose, onCTAClick }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isActive || !mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x8B5CF6, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00E5FF, 0.8, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Create AR product (a rotating holographic cube)
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.8,
      emissive: 0x220066,
    });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    scene.add(cube);

    // Add wireframe overlay
    const wireframeGeometry = new THREE.EdgesGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x00E5FF });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    cube.add(wireframe);

    // Floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const positions = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00E5FF,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // AR marker plane
    const markerGeometry = new THREE.PlaneGeometry(4, 4);
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.3,
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.rotation.x = -Math.PI / 2;
    marker.position.y = -2;
    marker.receiveShadow = true;
    scene.add(marker);

    // Animation loop
   const animate = () => {
  if (!scene || !renderer || !camera) return;

  animationRef.current = requestAnimationFrame(animate);

  // Rotate the cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.02;

  // Animate particles
  const positions = particles.geometry.attributes.position.array;
  for (let i = 1; i < positions.length; i += 3) {
    positions[i] -= 0.01;
    if (positions[i] < -10) {
      positions[i] = 10;
    }
  }
  particles.geometry.attributes.position.needsUpdate = true;

  // Floating cube animation
  cube.position.y = Math.sin(Date.now() * 0.001) * 0.5;

  renderer.render(scene, camera);
};


    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-card/20 backdrop-blur-md border-primary/30">
        <CardContent className="p-0 relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* AR Content */}
          <div className="relative">
            <div 
              ref={mountRef} 
              className="w-full h-96 rounded-t-lg overflow-hidden relative"
              style={{ minHeight: '400px' }}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-primary font-semibold">Initializing AR Experience...</p>
                  </div>
                </div>
              )}
            </div>

            {/* AR Scanner overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-secondary"></div>
              <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-secondary"></div>
              <div className="absolute bottom-24 left-8 w-8 h-8 border-l-2 border-b-2 border-secondary"></div>
              <div className="absolute bottom-24 right-8 w-8 h-8 border-r-2 border-b-2 border-secondary"></div>
              
              {/* Scanning line effect */}
              <div className="absolute inset-x-0 top-1/2 h-0.5 ar-scan-line opacity-60"></div>
            </div>
          </div>

          {/* Product Info & CTAs */}
          <div className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold gradient-text">Holographic Product Demo</h3>
              <p className="text-muted-foreground">
                Experience our latest product in stunning 3D AR visualization
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                variant="cta"
                size="lg"
                onClick={() => onCTAClick('buy')}
                className="flex-1 max-w-48"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onCTAClick('info')}
                className="flex-1 max-w-48"
              >
                <Info className="w-5 h-5" />
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};