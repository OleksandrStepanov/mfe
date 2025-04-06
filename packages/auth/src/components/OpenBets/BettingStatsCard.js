import * as React from "react";
import styled from "styled-components";
import moment from 'moment';
import { StatItem } from "./StatItem";
import allMockAPIs from "./../MockAPI"
import formatNumberWithCommasNumber from "./../utils"
import {useEffect, useState} from "react";

export default function BettingStatsCard({ data, auth }) {
    const [isLoading, setIsLoading] = useState(true);
    const [resultOpenBets, setResultOpenBets] = useState(allMockAPIs().rep_cross_product_dashboard_open_bets.result);

    const statsData = [
        {
            id: "open-bets",
            value: formatNumberWithCommasNumber(Number(resultOpenBets[0].opened_bets_cnt).toFixed(0)),
            label: "Open bets"
        },
        {
            id: "stake-amount",
            value: `€${formatNumberWithCommasNumber(Number(resultOpenBets[0].stake_amount).toFixed(0))}`,
            label: "Stake Amount"
        },
        {
            id: "possible-winning",
            value: `€${formatNumberWithCommasNumber(Number(resultOpenBets[0].possible_winnings).toFixed(0))}`,
            label: "Possible Winning"
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
                const result = await fetch(`${auth.Endpoint}?resourceName=rep_cross_product_dashboard_open_bets&namespace=datawarehouse`, requestOptions);
                const resultJson = await result.json();
                setResultOpenBets(resultJson.result);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false); // Set loading to false after API call completes
            }
        }

        fetchData();
    }, [data, auth]);

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
            aria-label="Betting Statistics Summary"
            tabIndex="0"
        >
            <HeaderSection>
                <StatsIcon
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/7026a23450f948c886940fbe4a74a722/324bb928470d44a34233ff965cb290679dac0c746b269208537f0948a2b29422?apiKey=7026a23450f948c886940fbe4a74a722&"
                    alt="Betting statistics icon"
                    aria-hidden="true"
                />
                <HeaderText>Open bets</HeaderText>
            </HeaderSection>
            <StatsGrid>
                {statsData.map((stat, index) => (
                    <StatItem
                        key={stat.id}
                        value={stat.value}
                        label={stat.label}
                        index={index}
                    />
                ))}
            </StatsGrid>
        </StatsContainer>
    );
}

const StatsContainer = styled.section`
  border-radius: 12px;
  background: var(--text-0, #fff);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  flex: 49%;
  height: 188px;
  flex-direction: column;
  font-family: Inter, sans-serif;
  text-align: center;

  &:focus {
    outline: 2px solid #4A90E2;
    outline-offset: 2px;
  }

  @media screen and (max-width: 480px) {
    padding: 16px 16px 32px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 16px;
  font-size: 20px;
  color: #e4002b;
  font-weight: 700;
  line-height: 1;
  margin-top: 20px;
  margin-left: 20px;
`;

const StatsIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 32px;
  border-radius: 4px;
  align-self: stretch;
  margin: auto 0;
`;

const HeaderText = styled.h2`
  font-variant-numeric: lining-nums proportional-nums;
  align-self: stretch;
  margin: auto 0;
  font-size: 20px;
  color: inherit;
`;

const StatsGrid = styled.div`
  display: flex;
  margin-top: 29px;
  min-height: 67px;
  width: 100%;
  align-items: center;
  gap: 10px;
  color: var(--dark-text, #302d34);
  font-weight: 400;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 991px) {
    gap: 16px;
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