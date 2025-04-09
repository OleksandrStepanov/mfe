import { useState, useEffect, useCallback, useRef } from 'react';

const useSession = () => {
    const [headers, setHeaders] = useState({ Signature: "", UserIp: "", Endpoint: "https://ubo.stage.dm.everymatrix.com/acs-proxy" }); // Initialize state with defaults
    const isMounted = useRef(true);

    const listener = useCallback((event) => {
        // if (!isMounted.current) {
        //     console.warn('Attempted to update state on unmounted component.');
        //     return;
        // }
        //
        // // Verify the origin of the message.
        // if (event.origin !== window.origin) {
        //     console.warn("Message origin is not trusted.");
        //     return;
        // }

        // Validate event payload and update state
        if (event.data?.type === 'SetRequestHeaders' && event.data.payload) {
            console.log(event, 'ev')
            const payload = {
                Signature: event.data.payload?.Signature || '',
                UserIp: event.data.payload?.UserIp || '',
                Endpoint: "https://ubo.stage.dm.everymatrix.com/acs-proxy",
            };
            if (payload.Signature && payload.UserIp) {
                setHeaders(payload);
            } else {
                console.error('Invalid payload structure:', event.data.payload);
            }
        } else {
            console.warn('Invalid or missing payload:', event.data);
        }
    }, []);

    const getHeaders = useCallback(() => {
        window.postMessage({ type: 'GetRequestHeaders' }, '*');
        window.addEventListener('message', listener);

        // Add a timeout to remove the listener if a response is not received.
        const timeoutId = setTimeout(() => {
            window.removeEventListener('message', listener);
            console.warn("Message listener timed out.");
        }, 5000);

        return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
    }, [listener]);

    useEffect(() => {
        isMounted.current = true; // Set to true when mounted

        getHeaders(); // Initial call

        const intervalId = setInterval(getHeaders, 1200000); // Every 20 minutes

        return () => {
            console.log('useSession cleanup function called - setting isMounted to false');
            clearInterval(intervalId);
            window.removeEventListener('message', listener);
            isMounted.current = false; // Set isMounted to false on unmount
        };
    }, [getHeaders, listener]);

    return { headers };
};

export default useSession;
