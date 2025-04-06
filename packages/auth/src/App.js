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
    "Signature": "71X+mKFvfSixyA+D:1Jz7/EF224Fa5hLavj/nBelGNAE5AnuUEA/MZVNdCszm2V9pYyw8oj7D1uGsTIQ6f6HsOvGU282sYld1QlSjFrk5afuSsDaSx72hkJUlETXU0NWE22mbO84v9xrzx/B/bBmFEzFM57FtRVo4w3Aupi/e/QPvaFXBe+liWWqmAOEdcsF8lZHvR4R2TKmqS14PTbCF0FZM3lCrlmSkOoBdGERa7Vm6AK0AGopfTN5i+p8NJ/snDvyedhQROw8+r1sds947YRRurDhhhHBHojF3C6e9RcjbnJsW2Lxr1uEf4WqKpk6yYcJHO7zUpdt/mPKgIiylC4HramupsVuR8Fr7FAjgZGitQHgDbA8xl4asjTjzIckRlQ==",
    "UserIp": "127.0.0.1",
    "UserAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
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
            <ToolbarLayout onDataChange={handleInputsChange} auth={authHeaders}/>
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
