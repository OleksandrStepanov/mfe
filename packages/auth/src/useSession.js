import { useState, useEffect, useCallback, useRef } from 'react';

const useSession = () => {
    const [headers, setHeaders] = useState(null);
    const isMounted = useRef(false);

    const listener = useCallback((event) => {
        console.log('Listener called - isMounted:', isMounted.current);
        if (event.data?.type === 'SetRequestHeaders' && event.data.payload && isMounted.current) {
            window.removeEventListener('message', listener);
            const payload = {
                Signature: event.data.payload?.Signature || '',
                UserIp: event.data.payload?.UserIp || '',
            };
            if (payload.Signature && payload.UserIp) {
                setHeaders(payload);
            } else {
                console.error('Invalid payload structure:', event.data.payload);
            }
        } else if (!isMounted.current) {
            console.warn('Attempted to update state on unmounted component.');
        } else {
            console.warn('Invalid or missing payload:', event.data);
        }
    }, [setHeaders]);

    const getHeaders = useCallback(() => {
        window.postMessage({ type: 'GetRequestHeaders' }, '*');
        window.addEventListener('message', listener);
    }, [listener]);

    useEffect(() => {
        isMounted.current = true; // Set isMounted to true when component mounts

        const setupHeaders = () => {
            getHeaders(); // Initial call

            const intervalId = setInterval(getHeaders, 1200000); // Every 20 minutes

            return () => {
                console.log('useSession cleanup function called - setting isMounted to false');
                clearInterval(intervalId);
                window.removeEventListener('message', listener);
                isMounted.current = false;
            };
        };

        return setupHeaders();
    }, [getHeaders, listener]);

    return { headers };
};

export default useSession;