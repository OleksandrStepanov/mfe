"use client";
import * as React from "react";
import styled from "styled-components";
import moment from 'moment';
import { useState, useRef, useEffect } from "react";
import { ChartLegendItem } from "./ChartLegendItem";
import { DonutProductChart } from "./DonutProductChart";
import allMockAPIs from "../MockAPI";
const chartTypes = [
    {
        id: "casino",
        label: "Casino",
        defaultValue: Number(allMockAPIs().overview.result[0].bets_number),
        defaultChecked: true,
        activeIcon: "https://cdn.builder.io/api/v1/image/assets/7026a23450f948c886940fbe4a74a722/d1f088f345ebacd7ac3e7247898fc96132866ac1f408e1b8686b9f3275576086",
        inactiveIcon: "https://placehold.co/16x16"
    },
    {
        id: "sport",
        label: "Sport",
        defaultValue: Number(allMockAPIs().overview.result[1].bets_number),
        defaultChecked: true,
        activeIcon: "https://cdn.builder.io/api/v1/image/assets/7026a23450f948c886940fbe4a74a722/38a0b94af88c122ec504d0133002d6db8baf409e50cc39076747dc2223457fb9",
        inactiveIcon: "https://placehold.co/16x16"
    }
];

export default function ProductTypeChart({ onCasinoToggle, isCasinoChartVisible, onSportToggle, isSportChartVisible, data, auth }) {
    const [isLoading, setIsLoading] = useState(true);
    const [resultProductType, setResultProductType] = useState(
        allMockAPIs().overview.result
    );

    const [chartData, setChartData] = useState({
        casino: {
            checked: isCasinoChartVisible,
            value: 0
        },
        sport: {
            checked: isSportChartVisible,
            value: 0
        }
    });

    function toggleFilter(type) {
        const newChecked = !chartData[type].checked;
        setChartData(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                checked: newChecked,
            },
        }));

        // Notify parent component
        if (type === "casino") {
            onCasinoToggle(newChecked);
        } else if (type === "sport") {
            onSportToggle(newChecked);
        }
    }

    const getSeriesData = () => {
        if (!resultProductType?.length) return {};

        return {
            casino: chartData.casino.checked ? Number(resultProductType[0]?.bets_number || 0) : 0,
            sport: chartData.sport.checked ? Number(resultProductType[1]?.bets_number || 0) : 0
        };
    };

    useEffect(() => {
        if (!auth || !auth.Signature || !auth.UserIp || !auth.Endpoint) {
            console.warn("Auth headers missing, waiting for authentication...");
            return; // Exit effect early if auth is not ready
        }
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const requestOptions = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Signature': auth.Signature,
                        'ubo-user-ip': auth.UserIp
                    },
                    body: JSON.stringify({
                        p_report_params: {
                            p_affiliate_marker: [],
                            p_bet_category_id: [],
                            p_columns_to_show: [
                                "bets_number",
                                "avg_bets_amount",
                                "margin",
                                "turnover",
                                "ngr",
                                "ggr",
                                "bonus_costs",
                            ],
                            p_content_provider_id: [],
                            p_currency_code: null,
                            p_date_from: data && data.dates[0] ? moment(data.dates[0]).format("YYYY-MM-DD HH:mm:ss.SSS") : moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
                            p_date_to: data && data.dates[1] ? moment(data.dates[1]).format("YYYY-MM-DD HH:mm:ss.SSS") : moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
                            p_domains: data.domains ? data.domains : [2319],
                            p_em_product_id: [0, 1],
                            p_event_id: [],
                            p_execution_type: "report",
                            p_free_bet: null,
                            p_game_id_vendor_id: [],
                            p_include_test_users: null,
                            p_invoicing_group_code: [],
                            p_is_live: null,
                            p_league_id: [],
                            p_license: [],
                            p_limit: 500,
                            p_location_id: [],
                            p_market_id: [],
                            p_offset: 0,
                            p_order_by: null,
                            p_order_by_asc_desc: null,
                            p_period_grouping: null,
                            p_report_category_id: [],
                            p_report_currency: "EUR",
                            p_scope1: "em_product_id",
                            p_scope2: null,
                            p_scope3: null,
                            p_sport_id: [],
                            p_template_name: null,
                            p_terminal_type: [],
                            p_timezone: "+00:00",
                            p_tracing_info: "oleksandr.stepanov@everymatrix.com",
                            p_user_country_code: null,
                            p_user_id: [],
                            p_user_name: [],
                            p_user_role: [],
                            p_vendor_id: [],
                        },
                    }),
                };
                const response = await fetch(
                    `${auth.Endpoint}?resourceName=rep_gaming_activity_report&namespace=datawarehouse`,
                    requestOptions
                );
                const resultJson = await response.json();
                setResultProductType(resultJson.result);

                // Update chart data with new values from API
                setChartData(prev => ({
                    casino: {
                        ...prev.casino,
                        value: Number(resultJson.result[0]?.bets_number || 0)
                    },
                    sport: {
                        ...prev.sport,
                        value: Number(resultJson.result[1]?.bets_number || 0)
                    }
                }));

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

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
        <ChartContainer role="region" aria-label="Product Type Distribution Chart">
            <ChartHeader>Product Type</ChartHeader>
            <DonutProductChart series={getSeriesData()} />
            <ChartFooter>
                <ChartLegend>
                    {chartTypes.map(type => (
                        <ChartLegendItem
                            key={type.id}
                            isChecked={chartData[type.id].checked}
                            label={type.label}
                            activeIcon={type.activeIcon}
                            inactiveIcon={type.inactiveIcon}
                            onToggle={() => toggleFilter(type.id)}
                            onChange={() => onCasinoToggle(chartData[type.id].checked)}
                        />
                    ))}
                </ChartLegend>
            </ChartFooter>
        </ChartContainer>
    );
}

const ChartContainer = styled.div`
  justify-content: space-between;
  border-radius: 12px;
  background: var(--text-0, #fff);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  flex: 20%; 
  flex-direction: column;
  font-family: Inter, sans-serif;
  padding: 20px;
  .apexcharts-toolbar{
    display:none;
  }
`;

const ChartHeader = styled.h2`
  font-variant-numeric: lining-nums proportional-nums;
  align-self: stretch;
  flex: 1;
  width: 100%;
  gap: 8px;
  font-size: 20px;
  color: var(--text-900, #343a40);
  font-weight: 700;
  margin: 0;
`;

const ChartFooter = styled.div`
  display: flex;
  margin-top: 39px;
  width: 100%;
  align-items: center;
  font-size: 10px;
  color: var(--text-800, #5f666c);
  font-weight: 600;
  white-space: nowrap;
  justify-content: space-between;
`;

const ChartLegend = styled.div`
  width: 100%;
  align-self: stretch;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  margin: auto 0;
`;

const StatsContainer = styled.section`
  justify-content: space-between;
  border-radius: 12px;
  background: var(--text-0, #fff);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  flex: 20%; 
  flex-direction: column;
  font-family: Inter, sans-serif;
  padding: 20px 0;
  text-align: center;

  &:focus {
    outline: 2px solid #4A90E2;
    outline-offset: 2px;
  }

  @media screen and (max-width: 480px) {
    padding: 16px 16px 32px;
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