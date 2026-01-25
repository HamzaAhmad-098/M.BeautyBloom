import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import MobileNavigation from '../layout/MobileNavigation';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

const Layout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Mobile Navigation (Bottom Bar) */}
      {isMobile && <MobileNavigation />}
      
      <main className={`flex-grow ${isMobile ? 'pb-16 pt-16' : 'pt-4'}`}>
        <Outlet />
      </main>
      
      <Footer />
      
      <Toaster 
        position={isMobile ? "top-center" : "top-right"}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: isMobile ? '14px' : '16px',
            maxWidth: isMobile ? '90vw' : '400px',
            borderRadius: '8px',
            padding: isMobile ? '12px' : '16px',
          },
          success: {
            style: {
              background: '#10b981',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;