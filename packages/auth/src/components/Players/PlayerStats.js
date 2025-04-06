import * as React from "react";
import moment from 'moment';
import styled from "styled-components";
import StatCard from "./StatCard";
import PlayerStatsHeader from "./PlayerStatsHeader";
import allMockAPIs from "./../MockAPI"
import formatNumberWithCommasNumber from "./../utils"
import {useEffect, useState} from "react";



function PlayerStats({ data, auth }) {
    const [isLoading, setIsLoading] = useState(true);
    const [resultPlayerRegistration, setResultPlayerRegistration] = useState(allMockAPIs().rep_cross_product_dashboard_registration.result);
    const [selectedDates, setSelectedDates] = useState(null);

    const playerStatsData = [
        {
            id: "total-players",
            value: formatNumberWithCommasNumber(resultPlayerRegistration[0].total_players),
            label: "Total Players",
            ariaLabel: "Total number of players"
        },
        {
            id: "new-players",
            value: formatNumberWithCommasNumber(resultPlayerRegistration[0].users_registrations),
            label: "New Players",
            ariaLabel: "Number of new players"
        }
    ];

    useEffect(() => {
        if (!auth || !auth.Signature || !auth.UserIp || !auth.Endpoint) {
            console.warn("Auth headers missing, waiting for authentication...");
            return; // Exit effect early if auth is not ready
        }
        const fetchData = async () => {
            try {
                setIsLoading(true); // Set loading to true before API call
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Signature': auth.Signature,
                        'ubo-user-ip': auth.UserIp
                    },
                    body: JSON.stringify({
                        "p_report_params": {
                            "p_currency_code": [],
                            "p_date_from": data && data.dates[0] ? moment(data.dates[0]).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
                            "p_date_to": data && data.dates[1] ? moment(data.dates[1]).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
                            "p_domains": data.domains ? data.domains : [2319],
                            "p_execution_type": "report",
                            "p_report_currency": "EUR",
                            "p_template_name": null
                        }
                    })
                };
                const result = await fetch(`${auth.Endpoint}?resourceName=rep_cross_product_dashboard_registration&namespace=datawarehouse`, requestOptions);
                const resultJson = await result.json();
                setResultPlayerRegistration(resultJson.result);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false); // Set loading to false after API call completes
            }
        }

        fetchData();
    }, [selectedDates, data, auth]);

    if (isLoading) {
        return (
            <StatsContainer>
                <LoadingSpinner /> {/* Create this component for your loader */}
            </StatsContainer>
        );
    }
    return (
        <StatsContainer
            role="region"
            aria-label="Player Statistics Dashboard"
            tabIndex="0"
        >
            <PlayerStatsHeader />
            <StatsGrid>
                <StatsWrapper>
                    {playerStatsData.map((stat) => (
                        <StatCard
                            key={stat.id}
                            value={stat.value}
                            label={stat.label}
                            ariaLabel={stat.ariaLabel}
                        />
                    ))}
                </StatsWrapper>
            </StatsGrid>
        </StatsContainer>
    );
}

const StatsContainer = styled.section`
  border-radius: 12px;
  background: var(--text-0, #fff);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-family: Inter, sans-serif;
  text-align: center;
  height: 188px;
  flex: 49%;

  &:focus {
    outline: 2px solid #307fe2;
    outline-offset: 2px;
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    transition: outline-offset 0.2s ease-in-out;
  }
`;

const StatsGrid = styled.div`
  display: flex;
  margin-top: 10px;
  min-height: 67px;
  width: 100%;
  flex-direction: column;
  color: var(--dark-text, #302d34);

  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const StatsWrapper = styled.div`
  display: flex;
  min-height: 58px;
  width: 100%;
  align-items: center;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const LoadingSpinner = styled.div`
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: auto;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

export default PlayerStats;