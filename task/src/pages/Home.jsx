import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Sparkles, Zap, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import heroImage from '../assets/black.jpg';
import Analytics from '../components/AnalyticsPanel';
import ARViewer from '../components/ARViewer';
import QRCodeGenerator from '../components/QRCodeDisplay';
import Header from '../components/Header';
import { motion } from 'framer-motion';

const Index = () => {
  const [isARActive, setIsARActive] = useState(false);
  const [scanCount, setScanCount] = useState(1247);
  const [sessionTime, setSessionTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setScanCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval;

    if (isARActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isARActive]);

  const handleQRScan = () => {
    setIsARActive(true);
    setScanCount(prev => prev + 1);
    setSessionTime(0);
    toast({
      title: "QR Code Scanned!",
      description: "Initializing AR experience...",
    });
  };

  const handleARClose = () => {
    setIsARActive(false);
    toast({
      title: "AR Session Ended",
      description: `Session lasted ${sessionTime} seconds`,
    });
  };

  const handleCTAClick = (action) => {
    toast({
      title: action === 'buy' ? "Redirecting to Store" : "Opening Product Info",
      description: action === 'buy' ? "Taking you to the purchase page..." : "Loading detailed product information...",
    });

    setTimeout(() => handleARClose(), 1000);
  };

  const analyticsData = {
    totalScans: scanCount,
    uniqueUsers: Math.floor(scanCount * 0.73),
    averageTime: "2m 34s",
    conversionRate: 12.8
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            src={heroImage} 
            alt="AR Experience" 
            className="w-full h-full object-cover"
            initial={{ scale: 1.05, opacity: 0.8 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80"></div>
        </div>
        <Header/>
        <div className="relative z-10 container mx-auto px-4 py-32 text-center">
          <motion.div 
            className="max-w-4xl mx-auto space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-6 py-2 text-sm font-semibold shadow-lg" variants={itemVariants}>
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Next-Gen AR Experience</span>
            </motion.div>

            <motion.h1 className="text-5xl md:text-7xl font-extrabold tracking-tight" variants={itemVariants}>
              Experience <span className="gradient-text">Print Come to Life</span>
            </motion.h1>

            <motion.p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto" variants={itemVariants}>
              Scan QR codes to unlock immersive AR experiences that transform static content into interactive 3D worlds
            </motion.p>

            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12" variants={containerVariants}>
              {[
                { icon: Zap, title: "Instant AR", description: "No app downloads required" },
                { icon: Sparkles, title: "3D Visualization", description: "Stunning holographic displays" },
                { icon: Users, title: "Analytics", description: "Real-time campaign insights" }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={index} variants={itemVariants} whileHover={{ y: -5, scale: 1.05 }}>
                    <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg h-full">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-xl drop-shadow-sm">{feature.title}</h3>
                        <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="py-24 container mx-auto px-4">
        <motion.div 
          className="text-center space-y-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-bold gradient-text">Try the Experience</h2>
            <p className="text-lg text-muted-foreground">Generate and scan a QR code to see AR magic in action</p>
          </div>

          <QRCodeGenerator onScan={handleQRScan} />

          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ar" 
              size="xl"
              onClick={handleQRScan}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-xl rounded-full"
            >
              <Zap className="w-5 h-5 mr-2" />
              Launch AR Demo
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Analytics Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <Analytics data={analyticsData} />
        </div>
      </section>

      <ARViewer isActive={isARActive} onClose={handleARClose} onCTAClick={handleCTAClick} />

      {/* Decorative Elements */}
      <div className="fixed top-1/4 left-10 w-3 h-3 bg-purple-500 rounded-full animate-pulse opacity-50 hidden lg:block"></div>
      <div className="fixed top-2/3 right-20 w-2 h-2 bg-pink-500 rounded-full animate-ping opacity-50 hidden lg:block"></div>
      <div className="fixed bottom-1/3 left-1/4 w-4 h-4 bg-blue-500 rounded-full animate-bounce opacity-40 hidden lg:block"></div>
    </div>
  );
};

export default Index;