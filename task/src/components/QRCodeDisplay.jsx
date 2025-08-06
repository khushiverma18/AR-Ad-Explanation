import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [generated, setGenerated] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

const handleGenerate = async () => {
  if (!url) return;
  setGenerated(true);
  setDownloadUrl(url);

  try {
    await fetch('http://localhost:5000/api/analytics/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campaignId: extractCampaignIdFromURL(url), // Customize based on how campaign ID is encoded
        timeSpent: 0 // Optional or later calculated
      }),
    });
    console.log('Scan recorded successfully');
  } catch (err) {
    console.error('Failed to record scan:', err);
  }
};

  const handleDownload = () => {
    const canvas = document.getElementById('qr-gen');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qrcode.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black bg-opacity-60 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto mt-10 text-white font-sans"
    >
      <h2 className="text-3xl font-bold mb-4 text-center tracking-wide">🚀 QR Code Generator</h2>

      <motion.input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to encode"
        className="border border-white/20 bg-white/10 placeholder-white/70 text-white p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        whileFocus={{ scale: 1.03 }}
      />

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={handleGenerate}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition text-white px-4 py-2 rounded-lg w-full font-semibold shadow-lg"
      >
        Generate QR
      </motion.button>

      <AnimatePresence>
        {generated && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 text-center"
          >
            <QRCodeCanvas
              id="qr-gen"
              value={url}
              size={180}
              level="H"
              includeMargin={true}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 transition mt-4 text-white px-4 py-2 rounded-lg font-medium shadow-md"
            >
              Download PNG
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
