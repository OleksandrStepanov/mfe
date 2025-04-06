import React, {useEffect, useState} from 'react';
import ReactDOM from "react-dom"
import { Switch, Route, Router } from 'react-router-dom';
import r2wc from "react-to-webcomponent"
// import TreemapChart from './TreemapChart';
import styled from "styled-components";
import ToolbarLayout from './components/Filters/ToolbarLayout';
import BalanceCard from './components/Balances/BalanceCard';
import PlayerStats from './components/Players/PlayerStats';
import FinancialPerformanceCard from './components/Finance/FinancialPerformance';
import RegisteredDepositedCard from './components/Registration/AnalyticsCard';
import BettingStatsCard from './components/OpenBets/BettingStatsCard';
import ApexChart from './components/TreeMap/TreeMap';
import ApexChartSport from './components/TreeMapSport/TreeMapSport';
import FinancialMetricsChart from './components/ProductChart/ProductTypeChart';
import MetricsChart from './components/ProductsBarChart/MetricsChart';
import {
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';
// const Greeting = ({ name }) => {
//     return <h1>Hello, {name}!</h1>
// }
// const WebGreeting = r2wc(Greeting, React, ReactDOM, {
//     props: {
//         name: "string",
//     },
// })
// console.log(WebGreeting, 'WebGreeting');
// customElements.define("web-greeting", WebGreeting)


const generateClassName = createGenerateClassName({
  productionPrefix: 'au',
});
const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    // flex-flow: row wrap;
    gap: 10px; /* Spacing between boxes */
    // section {
    //     border:1px solid #ccc;
    //     padding: 1em  1em;
    //     flex: 1;
    //    }
`;
const NestedContainer = styled.div`
    display: flex;
    // flex-wrap: wrap;
    gap: 10px; /* Spacing between boxes */
    flex-flow: row wrap;
    flex: 65%;
    width: 100%;
    
`;
const WrapperChart = styled.div`
    display: flex;
    width: 100%;
    gap: 10px;
    flex: 100%;
`;

const authHeaders = {
    "Signature": "CEMA+l7DTqb+ERzB:7ptM/7rwemuUtjjbYk2Yp3UE8apwSzOmacY6w7aX1mEzyljA/6MN9+PRkPq/4Do1vbciJY1EoXnESRwyOvYj7PAvqxVRId+UL+KVtYQPdlR+MIc846VvvVKpM3xVciMPSvn8q50Q8XhGMDQOgEpB60b3g6DX7H7EeViKSHU4IZrtPjI34W++6nzXZTFjIYIbfTybS9H14GQUk/el065nFNmqyyaX2Cf/7DM/fJFrSRKX5+Vte3ySxaDkpK+DWxcH8RJSi0hJ8T1HRHy7utDdrmB6LrXKoOsCbsmi37Y5CSYNm8iJ/MTECrc37OGc/KcuacYsuDP9cNzTezqRwPZMPhmU0gb9X0EtH5lTA7r/lMtzvljFVw==",
    "UserIp": "127.0.0.1",
    "Endpoint": "https://ubo.stage.dm.everymatrix.com/acs-proxy"
};

// Send the message (targetOrigin should be '*' for local testing, change for security)
setTimeout(() => {
    window.postMessage({ type: 'GetAuthHeaders', data: authHeaders }, '*');
}, 0)


export default ({ domain_ids, onSignIn }) => {
    const [count, setCount] = useState(0);
    const [sharedData, setSharedData] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    //show casino handle
    const [showCasino, setShowCasino] = useState(true);
    const [domainValue, setDomainValue] = useState(true);
    const [authHeaders, setAuthHeaders] = useState({});
    const handleCasinoToggle = (newValue) => {
        setShowCasino(newValue);
    };
    const [showSport, setShowSport] = useState(true);
    const handleSportToggle = (newValue) => {
        setShowSport(newValue);
    };

    const handleInputsChange = (data) => {
        setSharedData(data); // Update the shared state
    };
    
    const fetchIP = async () => {
        try {
            const response = await fetch('https://api.ipify.org');
            const data = await response.text();
            setIpAddress(data);
            authHeaders.UserIp = data;
        } catch(error) {
            console.log('Failed to fetch IP:', error);
        }
    };



    useEffect(() => {
        // Define message event handler
        const handleMessage = (event) => {
            // Security check: Ensure event origin is expected (change '*' to your domain)
            if (event.origin !== '*' && event.origin !== "http://localhost:8082") {
                console.warn("Blocked message from unauthorized origin:", event.origin);
                return;
            }

            // Check if the message is of type 'GetAuthHeaders'
            if (event.data && event.data.type === 'GetAuthHeaders') {
                // alert('Bingo')
                // console.log(event.data.data, 'event.data.data')
                setAuthHeaders(event.data.data);
                // setAuthHeaders(authHeaders);
            }
        };

        // Add event listener
        window.addEventListener('message', handleMessage);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);
    //end show casino
    useEffect(() => {
        fetchIP();
    },[]);

    return (
        <Container>
            <web-greeting name="Justin"></web-greeting>
            <ToolbarLayout onDataChange={handleInputsChange} />
            <NestedContainer>
                <PlayerStats data={sharedData} auth={authHeaders}/>
                <BalanceCard data={sharedData} auth={authHeaders}/>
                <RegisteredDepositedCard data={sharedData} auth={authHeaders}/>
                <BettingStatsCard data={sharedData} auth={authHeaders}/>
            </NestedContainer>
            <FinancialPerformanceCard sharedData={sharedData} auth={authHeaders} />
            <WrapperChart>
                <FinancialMetricsChart data={sharedData} auth={authHeaders} onCasinoToggle={handleCasinoToggle} isCasinoChartVisible={showCasino} onSportToggle={handleSportToggle} isSportChartVisible={showSport}/>
                <MetricsChart data={sharedData} auth={authHeaders} isCasinoChartVisible={showCasino} isSportChartVisible={showSport}/>
            </WrapperChart>
            {showCasino && <ApexChart data={sharedData} auth={authHeaders}/>}
            {showSport && <ApexChartSport data={sharedData} auth={authHeaders}/>}
        </Container>
    );
};
