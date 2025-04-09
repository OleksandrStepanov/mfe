import { useState, useEffect, useCallback } from 'react';

const useSession = () => {
    const [headers, setHeaders] = useState(null);

    const listener = useCallback((event) => {
        if (event.data?.type === 'SetRequestHeaders' && event.data.payload) {
            window.removeEventListener('message', listener);
            const payload = {
                Signature: event.data.payload?.Signature || '',
                UserIp: event.data.payload?.UserIp || '',
                Endpoint: "https://ubo.stage.dm.everymatrix.com/acs-proxy"
            };
            if (payload.Signature && payload.UserIp) {
                setHeaders(payload);
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
                clearInterval(intervalId);
                window.removeEventListener('message', listener);
            };
        };

        return setupHeaders();
    }, [getHeaders, listener]);

    return { headers };
};

export default useSession;