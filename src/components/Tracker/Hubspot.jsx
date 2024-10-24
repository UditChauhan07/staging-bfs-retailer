import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GetAuthData } from '../../lib/store';

const HubSpotTracker = () => {
    const location = useLocation();

    useEffect(() => {
        if (window.hj) {
          window.hj('stateChange', location.pathname);
          GetAuthData().then((user) => {
            console.log({ user });
            if (user) {
              window.hj('identify', user.Sales_Rep__c, {
                userName: user.Name,
              });
            }
    
          }).catch((err) => console.log({ err }))
        }
        console.log({aa:location.pathname});
        
      }, [location]);

    return null; // This component doesn't render anything
};

export default HubSpotTracker;