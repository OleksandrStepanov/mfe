import { useState, useEffect, useCallback, useRef } from 'react';

const useSession = () => {
    const [headers, setHeaders] = useState(null);
    const isMounted = useRef(true); // Ref to track component mount status

    const listener = useCallback((event) => {
        if (event.data?.type === 'SetRequestHeaders' && event.data.payload) {
            window.removeEventListener('message', listener);
            const payload = {
                Signature: event.data.payload?.Signature || '',
                UserIp: event.data.payload?.UserIp || '',
            };
            if (payload.Signature && payload.UserIp && isMounted.current) { // Check if mounted
                setHeaders(payload);
            } else if (!isMounted.current) {
                console.warn('Attempted to update state on unmounted component.');
            } else {
                console.error('Invalid payload structure:', event.data.payload);
            }
        } else {
            console.warn('Invalid or missing payload:', event.data);
        }
    }, [setHeaders]);

    const getHeaders = useCallback(() => {
        window.postMessage({ type: 'GetRequestHeaders' }, '*');
        window.addEventListener('message', listener);
    }, [listener]);

    useEffect(() => {
        const setupHeaders = () => {
            getHeaders(); // Initial call

            const intervalId = setInterval(getHeaders, 1200000); // Every 20 minutes

            return () => {
                console.log('useSession cleanup function called');
                clearInterval(intervalId);
                window.removeEventListener('message', listener);
                isMounted.current = false; // Set mounted status to false on unmount
            };
        };

        return setupHeaders();
    }, [getHeaders, listener]);

    return { headers };
};

export default useSession;