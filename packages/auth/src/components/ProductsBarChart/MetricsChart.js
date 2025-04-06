"use client";
import * as React from "react";
import styled from "styled-components";
import moment from 'moment';
import {useEffect, useState} from "react";
import ReactApexChart from 'react-apexcharts'
import allMockAPIs from "../MockAPI";

export default function FinancialMetricsChart({ isCasinoChartVisible, isSportChartVisible, data, auth }) {
    const [isLoading, setIsLoading] = useState(true);
    const [resultPlayerRegistration, setResultPlayerRegistration] = useState([]);
    const [timeGrouping, setTimeGrouping] = useState('month'); // Default grouping
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    let resultJson = {result: []};

    const [series, setSeries] = useState(() => {
        const initialData = transformData(
            [],
            isSportChartVisible,
            isCasinoChartVisible,
            isSportChartVisible && isCasinoChartVisible
        );
        return initialData;
    });

    const [chartOptions, setChartOptions] = useState(() => getChartOptions('month'));

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setIsLoading(true); // Set loading to true before API call
    //             const requestOptions = {
    //                 method: 'POST',
    //                 headers: { 'Content-type': 'application/json' },
    //                 body: JSON.stringify({
    //                     "p_report_params": {
    //                         "p_domains": [2304],
    //                         "p_group_by": "month",
    //                         "p_columns_to_show": ["sport_ggr", "real_sport_ggr", "bonus_sport_ggr", "sport_ngr", "sport_turnover", "real_sport_turnover", "bonus_sport_turnover", "casino_ggr", "real_casino_ggr", "bonus_casino_ggr", "casino_ngr", "casino_turnover", "real_casino_turnover", "bonus_casino_turnover", "total_ggr", "real_total_ggr", "bonus_total_ggr", "total_ngr", "total_turnover", "real_total_turnover", "bonus_total_turnover"],
    //                         "p_date_from": "2024-12-05 00:00:00",
    //                         "p_date_to": "2025-02-02 23:59:59",
    //                         "p_is_grandtotal": false
    //                     }
    //                 })
    //             };
    //             const result = await fetch('http://api-gateway.stage.dm.everymatrix.local/rpc/oh_performance_overview', requestOptions);
    //             const resultJson = await result.json();
    //             setResultPlayerRegistration(resultJson.result);
    //             console.log(resultJson.result, 'result');
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         } finally {
    //             setIsLoading(false); // Set loading to false after API call completes
    //         }
    //     }
    //
    //     fetchData();
    // }, []);


    function getChartOptions(grouping) {
        // Mock data for different time groupings
        const timeUnitData = {
            hours: allMockAPIs().turnover_sport_casino_hours?.result || [],
            day: allMockAPIs().turnover_sport_casino_day?.result || [],
            week: allMockAPIs().turnover_sport_casino_week?.result || [],
            month: allMockAPIs().turnover_sport_casino_month?.result || []
        };

        return {
            chart: {
                type: "bar",
                height: 350,
                stacked: true,
                toolbar: {
                    show: true,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "55%",
                    endingShape: "rounded",
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
            },
            xaxis: {
                categories: getTimeUnits(timeUnitData[grouping]),
            },
            yaxis: {
                title: {
                    text: "Amount ($)",
                },
                labels: {
                    formatter: function(value) {
                        return "$" + value.toFixed(0);
                    }

                },
            },
            fill: {
                opacity: 0.5,
            },
            tooltip: {
                y: {
                    formatter: function (value) {
                        return "$" + value.toFixed(2);
                    },
                },
            },
        };
    }

    function getTimeUnits(data) {
        return data.map(item => item.timeunit_id);
    }

    const handleGroupingChange = (grouping) => {
        setTimeGrouping(grouping);
        setIsDropdownOpen(false);
        fetchData(grouping);
        // setTimeGrouping(grouping);
        // setIsDropdownOpen(false);
        //
        // // Get the appropriate data based on grouping
        // const data = {
        //     hours: allMockAPIs().turnover_sport_casino_hours?.result,
        //     day: allMockAPIs().turnover_sport_casino_day?.result,
        //     week: allMockAPIs().turnover_sport_casino_week?.result,
        //     month: allMockAPIs().turnover_sport_casino_month?.result
        // }[grouping];
        //
        // // Update chart options and series
        // setChartOptions(getChartOptions(grouping));
        // setSeries(transformData(
        //     data,
        //     isSportChartVisible,
        //     isCasinoChartVisible,
        //     isSportChartVisible && isCasinoChartVisible
        // ));
    };

    // // Modify handleGroupingChange to include API call
    // const handleGroupingChange = (grouping) => {
    //     setTimeGrouping(grouping);
    //     setIsDropdownOpen(false);
    //     fetchData(grouping); // Call fetchData with new grouping
    // };

// Move fetchData outside useEffect and make it reusable
    const fetchData = async (grouping) => {
        try {
            setIsLoading(true);
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Signature': auth.Signature,
                    'ubo-user-ip': auth.UserIp
                },
                body: JSON.stringify({
                    "p_report_params": {
                        "p_domains": data.domains ? data.domains : [2319],
                        "p_group_by": grouping, // Use the grouping parameter
                        "p_columns_to_show": [
                            "sport_ggr", "real_sport_ggr", "bonus_sport_ggr",
                            "sport_ngr", "sport_turnover", "real_sport_turnover",
                            "bonus_sport_turnover", "casino_ggr", "real_casino_ggr",
                            "bonus_casino_ggr", "casino_ngr", "casino_turnover",
                            "real_casino_turnover", "bonus_casino_turnover",
                            "total_ggr", "real_total_ggr", "bonus_total_ggr",
                            "total_ngr", "total_turnover", "real_total_turnover",
                            "bonus_total_turnover"
                        ],
                        "p_date_from": data && data.dates[0] ? moment(data.dates[0]).format("YYYY-MM-DD HH:mm:ss") : moment().format("YYYY-MM-DD HH:mm:ss"),
                        "p_date_to": data && data.dates[1] ? moment(data.dates[1]).format("YYYY-MM-DD HH:mm:ss") : moment().format("YYYY-MM-DD HH:mm:ss"),
                        "p_is_grandtotal": false
                    }
                })
            };

            const result = await fetch(`${auth.Endpoint}?resourceName=oh_performance_overview&namespace=datawarehouse`, requestOptions);
            resultJson = await result.json();

            // Update the chart data
            const newData = transformData(
                resultJson.result,
                isSportChartVisible,
                isCasinoChartVisible,
                isSportChartVisible && isCasinoChartVisible
            );
            setResultPlayerRegistration(resultJson.result);
            setSeries(newData);
            setChartOptions(getChartOptions(grouping));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

// Initial data fetch on component mount
    useEffect(() => {
        if (!auth || !auth.Signature || !auth.UserIp || !auth.Endpoint) {
            console.warn("Auth headers missing, waiting for authentication...");
            return; // Exit effect early if auth is not ready
        }
        fetchData(timeGrouping);
    }, [data, auth]); // Only run once on mount

// Update your dropdown section


// Optional: Add loading indicator
//     {isLoading && <LoadingSpinner />} // You'll need to create this component

    useEffect(() => {
        const updatedData = transformData(
            resultPlayerRegistration,
            isSportChartVisible,
            isCasinoChartVisible,
            isSportChartVisible && isCasinoChartVisible
        );

        if (JSON.stringify(updatedData) !== JSON.stringify(series)) {
            setSeries(updatedData);
        }
    }, [resultPlayerRegistration, isSportChartVisible, isCasinoChartVisible, timeGrouping]);

    if (isLoading) {
        return (
            <StatsContainer>
                <LoadingSpinner /> {/* Create this component for your loader */}
            </StatsContainer>
        );
    }

    return (
        <ChartContainer role="region" aria-label="Financial Metrics Chart">
            <HeaderContainer>
                <ChartTitle>Turnover, NGR, GGR</ChartTitle>
                <DropdownContainer>
                    <GroupingDropdown
                        role="button"
                        tabIndex="0"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') setIsDropdownOpen(!isDropdownOpen);
                        }}
                    >
                        <DropdownText>{`Group by ${timeGrouping}`}</DropdownText>
                        <DropdownIcon
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/7026a23450f948c886940fbe4a74a722/db417e6ab8d50d0da632a274fe44f5064720b52ca05e7c05753548e598a01917?apiKey=7026a23450f948c886940fbe4a74a722&"
                            alt=""
                        />
                    </GroupingDropdown>
                    {isDropdownOpen && (
                        <DropdownMenu role="menu">
                            {['hours', 'day', 'week', 'month'].map((option) => (
                                <DropdownItem
                                    key={option}
                                    role="menuitem"
                                    onClick={() => handleGroupingChange(option)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleGroupingChange(option);
                                    }}
                                    tabIndex="0"
                                >
                                    {`Group by ${option}`}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    )}
                </DropdownContainer>
            </HeaderContainer>
            <ChartContent>
                <div>
                    <ReactApexChart
                        type="bar"
                        options={chartOptions}
                        series={series}
                        height={350}
                    />
                </div>
            </ChartContent>
        </ChartContainer>
    );

    function transformData(data, is_sport = true, is_casino= true, is_overview = true) {
        const result = [];

        const metrics = [
            { name: "Turnover", fields: [is_sport ? "sport_turnover" : null, is_casino ? "casino_turnover" : null, is_overview ? "total_turnover" : null] },
            { name: "NGR", fields: [is_sport ? "sport_ngr"  : null, is_casino ? "casino_ngr" : null, is_overview ? "total_ngr" : null] },
            { name: "GGR", fields: [is_sport ? "sport_ggr" : null, is_casino ? "casino_ggr" : null, is_overview ? "total_ggr" : null] }
        ];

        metrics.forEach(metric => {
            const seriesData = data.map(item => {
                const values = metric.fields.map(field => parseFloat(item[field]));
                return values.reduce((sum, value) => sum + (value ? value : 0), 0);
            });
            result.push({ name: metric.name, data: seriesData });
        });

        return result;
    }
}

const ChartContainer = styled.section`
  border-radius: 12px;
  background: var(--text-0, #fff);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
  flex: 79%;
  width: 100%;
  flex-direction: column;
  padding: 14px 40px 32px 96px;
  @media (max-width: 991px) {
    padding: 0 20px;
  }
`;

const ChartContent = styled.div`
  display: flex;
  margin-top: 16px;
  padding-right: 60px;
  flex-direction: column;
  @media (max-width: 991px) {
    max-width: 100%;
    padding-right: 20px;
  }
  .apexcharts-toolbar{
    display:none;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  color: var(--text-900, #343a40);
  line-height: 1;
  flex-wrap: wrap;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const ChartTitle = styled.h2`
  font-variant-numeric: lining-nums proportional-nums;
  font-size: 20px;
  font-weight: 700;
  align-self: stretch;
  flex: 1;
  flex-basis: 32px;
  margin: auto 0;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const GroupingDropdown = styled.div`
  align-items: start;
  border-radius: 10px;
  border: 1px solid var(--outline-outline-primary, #dfe4ee);
  background: var(--text-0, #fff);
  align-self: stretch;
  display: flex;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  margin: auto 0;
  padding: 8px 16px;
  cursor: pointer;
  
  &:focus {
    outline: 2px solid var(--outline-outline-primary, #dfe4ee);
  }
`;

const DropdownText = styled.span`
  font-variant-numeric: lining-nums proportional-nums;
`;

const DropdownIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 16px;
`;

// Styled Components
const DropdownContainer = styled.div`
    position: relative;
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 1000;
`;

const DropdownItem = styled.div`
    padding: 8px 16px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
        background-color: #f5f5f5;
    }
`;

const StatsContainer = styled.section`
  border-radius: 12px;
  background: var(--text-0, #fff);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  flex: 79%;
  width: 100%;
  flex-direction: column;
  height: 460px;
  text-align: center;
  align-items: center;
  justify-content: center;

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