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
    "Signature": "3A1BiFh7gXbs7tGn:tSstV30McGFUyz0q30PC9mh7yQtj0mfhmH6u6W+zKoJ2gVIthhbcxxnPh8gaBKAqEWjHadE8C8qEsIHLKT0ijxUnyxEqffLJxuaF7ZFaZL+43bHFUmZwDO2VVUi6jGKFaTBFSejx9UNKQWkPl+He5ryFZqr9YxSxRAVxgnAYv4cENPnCZLXpkPof8z9b60Sm6/07fJj/YW+96WpAY79msTCJvhx12EDdlf6vjpRyYiuYvJlzKozsswMecYJVgPMhet6Xv9wGVFRLBHLudjLeZ2NXKBoGj3yQl4OY2rKdH8TD4CODzp5KKd3qj6HGp6pq0rJ7Rwe88L90NMITFdj8kgf5un5gNMOaxCL0XG3P3roLDfK12w==",
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
            const authHeaders2 = {
                "Signature": "TstHZfLqQgSjvKgI:RQDQEY+HLE1oortaUxuul/Y9xlMq0ejDjsiF2VP6E0KFX5aTXnwmBKAp4mDIsU+8GP6xKf8Q4BvNxDTzFbNKREQQR6g7YRPvRwAdW++iWvSiDXWniUv+rLsTTAAHwREPAFYbW+WxN5Yvu2hpUh/kgId4LgjIiBaa2tt07ag1kxJMtsI8bhdOHpNlO+FJXhs/tfRrdJiwcPdtN5o1ZRp/GbqG5Af9JVB8hxssI6QH3BDPn3aWR9MYeLAFeb3OFYsbV1DfZ+Gve6MvAYU7e+ZkljTP36sIMJ4Zo5/Jl1jDrJS8g0viAmKnC7tfI2cugQnIA9/bwHdwcTpkFa6zmGu/GtvZvPcNIfG/TVwXt386V1YwtV7I2A==",
                "UserIp": "127.0.0.1",
                "UserAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
                "Endpoint": "https://ubo.stage.dm.everymatrix.com/acs-proxy"
            };
            setAuthHeaders(authHeaders2);

            // setIpAddress(data);
            // authHeaders.UserIp = data;
        } catch(error) {
            console.log('Failed to fetch IP:', error);
        }
    };



    useEffect(() => {
        // Define message event handler
        const handleMessage = (event) => {
            // Security check: Ensure event origin is expected (change '*' to your domain)
            if (event.origin !== '*' && event.origin !== "https://d3r74pjt0alh8y.cloudfront.net") {
                console.warn("Blocked message from unauthorized origin:", event.origin);
                return;
            }

            // Check if the message is of type 'GetAuthHeaders'
            // if (event.data && event.data.type === 'GetAuthHeaders') {
            //     // alert('Bingo')
            //     // console.log(event.data.data, 'event.data.data')
            //     setAuthHeaders(event.data.data);
            //     // setAuthHeaders(authHeaders);
            // }
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
