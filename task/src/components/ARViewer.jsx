// ARViewer.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";

const ARViewer = () => {
  const containerRef = useRef();

  useEffect(() => {
    const startAR = async () => {
      try {
        const mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: "/targets.mind", // must be in public folder
        });

        const { renderer, scene, camera } = mindarThree;

        // Basic AR content (cube)
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const cube = new THREE.Mesh(geometry, material);

        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(cube);

        // Start AR only after ready
        await mindarThree.start();

        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });
      } catch (err) {
        console.error("AR start error:", err);
      }
    };

    startAR();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    />
  );
};

export default ARViewer;
