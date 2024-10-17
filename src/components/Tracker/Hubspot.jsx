import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HubSpotTracker = () => {
    const location = useLocation();

    useEffect(() => {
        if (window.hj) {
          window.hj('stateChange', location.pathname);
        }
        console.log({aa:location.pathname});
        
      }, [location]);

    return null; // This component doesn't render anything
};

export default HubSpotTracker;