import { useEffect, useRef } from "react";

const useBackgroundUpdater = (callback, interval = 300000) => { // 300000 ms = 5 minutes
    const intervalRef = useRef(null);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                clearInterval(intervalRef.current); // Stop updates when tab is inactive
            } else if (document.visibilityState === "visible") {
                startInterval(); // Restart updates when tab is active
            }
        };

        const startInterval = () => {
            clearInterval(intervalRef.current); // Clear any existing intervals
            intervalRef.current = setInterval(callback, interval); // Start new interval
        };

        // Start interval on component mount
        startInterval();

        // Add event listener for tab visibility change
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            // Cleanup interval and event listener on unmount
            clearInterval(intervalRef.current);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [callback, interval]);
};

export default useBackgroundUpdater;
