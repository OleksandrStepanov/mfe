import { useState, useEffect, useCallback, useRef } from 'react';

const useSession = () => {
    const [headers, setHeaders] = useState(null);
    const isMounted = useRef(true); // Initialize to true

    const listener = useCallback((event) => {
        if (!isMounted.current) {
            console.warn('Attempted to update state on unmounted component.');
            return;
        }

        //Verify the origin of the message.
        if(event.origin !== window.origin){
            console.warn("Message origin is not trusted.");
            return;
        }

        if (event.data?.type === 'SetRequestHeaders' && event.data.payload) {
            window.removeEventListener('message', listener);
            const payload = {
                Signature: event.data.payload?.Signature || '',
                UserIp: event.data.payload?.UserIp || '',
            };
            if (payload.Signature && payload.UserIp) {
                setHeaders(payload);
            } else {
                console.error('Invalid payload structure:', event.data.payload);
                // Consider setting a default state here
                setHeaders({Signature: "", UserIp: ""});
            }
        } else {
            console.warn('Invalid or missing payload:', event.data);
        }
    }, [setHeaders]);

    const getHeaders = useCallback(() => {
        window.postMessage({ type: 'GetRequestHeaders' }, '*');
        window.addEventListener('message', listener);
        //add a timeout to remove the listener if a response is not recieved.
        setTimeout(() => {
            window.removeEventListener('message', listener);
            console.warn("Message listener timed out.");
        }, 5000)

    }, [listener]);

    useEffect(() => {
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