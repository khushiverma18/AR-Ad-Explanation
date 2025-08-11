import React, { useState } from "react";
import './AR.css'; // adjust path if needed

export default function ARViewer() {
  const [videoPlaying, setVideoPlaying] = useState(false);

  const toggleVideo = () => {
    setVideoPlaying(prev => !prev);
  };

  const handleClose = () => {
    // Yahan apne link ya redirect ka logic daalo
    window.location.href = "https://ar-ad-explanation-1.onrender.com"; // Example: home page pe redirect
  };

  return (
    <div className="ar-container">
      <div className="ar-card">
        <h1 className="ar-title">AR Experience</h1>

        {videoPlaying ? (
          <div className="ar-video-wrapper">
            <button 
              onClick={handleClose} 
              className="ar-close-btn" 
              aria-label="Close AR experience"
            >
              &#x2715;
            </button>
            <video
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="ar-video"
            />
          </div>
        ) : (
          <div className="ar-placeholder">
            <p className="ar-placeholder-text">Scan the target image to play the AR content.</p>
          </div>
        )}

        <button
          onClick={toggleVideo}
          className="ar-cta-btn"
          aria-label={videoPlaying ? "Stop video" : "Play video"}
        >
          {videoPlaying ? "Stop" : "Play"}
        </button>
      </div>

      <p className="ar-footer">Powered by WebAR &bull; Made with ♥</p>
    </div>
  );
}
