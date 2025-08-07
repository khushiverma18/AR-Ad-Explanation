import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RefreshCw, Download, Scan } from 'lucide-react';

const QRCodeGenerator = ({ onScan }) => {
  const canvasRef = useRef(null);
  const [qrData, setQrData] = useState('https://ar-experience.demo/scan/product-001');

  const generateQRCode = async () => {
    if (canvasRef.current) {
      try {
        await QRCode.toCanvas(canvasRef.current, qrData, {
          width: 256,
          margin: 2,
          color: {
            dark: '#8B5CF6',
            light: '#FFFFFF'
          }
        });
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  };

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'ar-qr-code.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [qrData]);

  return (
    <Card className="w-full max-w-md mx-auto bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="gradient-text text-xl">AR QR Code</CardTitle>
        <p className="text-muted-foreground text-sm">
          Scan to trigger AR experience
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="relative p-4 bg-white rounded-lg shadow-lg">
            <canvas 
              ref={canvasRef} 
              className="block ar-glow rounded-md"
            />
            <div className="absolute inset-0 border-2 border-secondary/30 rounded-lg pointer-events-none animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex gap-2 justify-center">
          <Button
            variant="scan"
            size="sm"
            onClick={onScan}
            className="flex-1"
          >
            <Scan className="w-4 h-4" />
            Simulate Scan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={generateQRCode}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadQR}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
