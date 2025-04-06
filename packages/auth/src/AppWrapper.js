import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import r2wc from "react-to-webcomponent"

// Import your Auth component
import Auth from './App'; // Assuming Auth.js is in the same directory

// Create a wrapper component for Auth
const AuthWrapper = ({ domains, onSignIn }) => {
    const authRef = useRef(null);

    useEffect(() => {
        // Pass props to the Auth component when it's connected
        if (authRef.current) {
            authRef.current.domains = domains;
            authRef.current.onSignIn = onSignIn;
        }
    }, [domains, onSignIn]);

    return (
        <auth-component ref={authRef}></auth-component> // Use a custom element tag
    );
};

// Create the Web Component from the wrapper
const WebAuth = r2wc(AuthWrapper, React, ReactDOM, {
    props: {
        domains: {
            type: 'array',
        },
        onSignIn: {
            type: 'function',
        },
    },
});

// Define the custom element
customElements.define("auth-component", WebAuth);

export default AuthWrapper; // Export the wrapper component
