import { useState } from 'react';
import LocationsComponent from './find/Locations';
import BottomNav from '../components/BottomNav';
import SOSOverlay from '../components/SOSOverlay';
import { useEffect } from 'react';
import './Home.css';

export default function LocationsWrapper({ isAuthenticated, username }) {
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    const handleSOSOpen = () => setSosOpen(true);
    window.addEventListener('sos-open', handleSOSOpen);
    return () => window.removeEventListener('sos-open', handleSOSOpen);
  }, []);

  return (
    <>
      <LocationsComponent
        isAuthenticated={isAuthenticated}
        viewMode="list"
        username={username}
      />
      <BottomNav active="/find/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}
