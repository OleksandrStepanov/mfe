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
    "Signature": "B334koClsUkGd01q:FD/WFgoDD4P4H3+Q2+E+GY+m/kcpchhmtO+G8bGfPJKHlyt5DQh99XP8TV526hBsXFfORLHmodqiLSwzn43kF/e6l4krrZLez8OLQapV+0O9b+sIH2Hi8fFEtASR3PXy+HaIO8VasSAonxAJP7r20nJg3gf8P3HC22HhbY2YZzyc2CqJQKfYa4W9h3X6Ds6EzdAhrPRDJc1/PNg3Dn3Qwv3yrnM2TxU3exe6Tp3IsKq6p5T6GE5NQrxUEKe6YO3yYNZytx5mwwiAYcGSiWTrfys6baOCiXWZiENjhXczar939hEylE8sdd8o51frmVLEe7NM+Nm1x/NR1r6Z1Pw2mXWpUq/1y2j7aExh+aHdHeRF4QI9VQ==",
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
                "Signature": "B334koClsUkGd01q:FD/WFgoDD4P4H3+Q2+E+GY+m/kcpchhmtO+G8bGfPJKHlyt5DQh99XP8TV526hBsXFfORLHmodqiLSwzn43kF/e6l4krrZLez8OLQapV+0O9b+sIH2Hi8fFEtASR3PXy+HaIO8VasSAonxAJP7r20nJg3gf8P3HC22HhbY2YZzyc2CqJQKfYa4W9h3X6Ds6EzdAhrPRDJc1/PNg3Dn3Qwv3yrnM2TxU3exe6Tp3IsKq6p5T6GE5NQrxUEKe6YO3yYNZytx5mwwiAYcGSiWTrfys6baOCiXWZiENjhXczar939hEylE8sdd8o51frmVLEe7NM+Nm1x/NR1r6Z1Pw2mXWpUq/1y2j7aExh+aHdHeRF4QI9VQ==",
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
