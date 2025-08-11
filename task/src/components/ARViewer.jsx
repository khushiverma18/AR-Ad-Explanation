import { useEffect, useRef } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";

export default function ARViewer() {
  const containerRef = useRef(null);

  useEffect(() => {
    const startAR = async () => {
      const mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: "/targets/target.mind" // your trained target image file
      });

      const { renderer, scene, camera } = mindarThree;

      // Add a video or 3D model to play
      const video = document.createElement("video");
      video.src = "/ar-content.mp4";
      video.crossOrigin = "anonymous";
      video.loop = true;

      const texture = new THREE.VideoTexture(video);
      const geometry = new THREE.PlaneGeometry(1, 0.6);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const plane = new THREE.Mesh(geometry, material);

      const anchor = mindarThree.addAnchor(0);
      anchor.group.add(plane);

      // Start AR session
      await mindarThree.start();

      // Event: Play video when target visible
      anchor.onTargetFound = () => {
        video.play();
      };

      // Event: Stop video when target lost
      anchor.onTargetLost = () => {
        video.pause();
      };

      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };

    startAR();
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
