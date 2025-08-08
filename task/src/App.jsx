import React, { useState } from "react";
import { Toaster } from "./components/ui/toasters";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ARViewer from "./components/ARViewer";
import { Button } from "./components/ui/button";
import Index from "./pages/Home";

const queryClient = new QueryClient();

const App = () => {
  const [showAR, setShowAR] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index/>} />
            {/* You can pass props to Home if you want to trigger AR from there */}
          </Routes>
          {/* ARViewer is global and rendered on top */}
          {showAR && (
            <ARViewer
              isActive={showAR}
              onClose={() => setShowAR(false)}
              onCTAClick={() => console.log("CTA Clicked")}
            />
          )}
          {/* Optional: trigger button (remove in prod if not needed) */}
          <div className="fixed bottom-4 right-4">
            <Button onClick={() => setShowAR(true)}>Launch AR</Button>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
