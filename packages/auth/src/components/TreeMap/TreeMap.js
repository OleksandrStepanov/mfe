import React, {useEffect, useState} from "react";
import ReactApexChart from 'react-apexcharts'
import styled from "styled-components";
import allMockAPIs from "./../MockAPI"
import moment from "moment";

function mapData(inputData) {
    return inputData.map(item => ({
        x: item.scope1_field || 'Unknown', // Use the 'scope1_field' as the x-axis label
        y: parseFloat(item.ggr), // Use the 'ggr' value as the y-axis value, parsed as a float
    }));
}

export default function ApexChart({ data, auth }) {
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState({
        series: [{
            data: mapData(allMockAPIs().casino.result)
        }],
        options: {
            legend: {
                show: false
            },
            chart: {
                height: 350,
                type: 'treemap'
            },
            title: {
                text: '',
                align: 'center'
            },
            colors: [
                '#09292A', '#125254', '#1B7A7E', '#24A3A8', '#2DCCD2',
                '#81E0E4', '#81E0E4', '#81E0E4', '#81E0E4', '#81E0E4',
                '#81E0E4', '#81E0E4', '#81E0E4', '#81E0E4', '#81E0E4',
                '#81E0E4', '#81E0E4', '#81E0E4', '#81E0E4', '#81E0E4',
                '#81E0E4', '#81E0E4',
            ],
            plotOptions: {
                treemap: {
                    distributed: true,
                    enableShades: false
                }
            }
        },
    });

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
                            p_em_product_id: [0],
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
                            p_scope1: "vendor_id",
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

                // Update chart data with API response
                if (resultJson.result) {
                    setChartData(prevState => ({
                        ...prevState,
                        series: [{
                            data: mapData(resultJson.result)
                        }]
                    }));
                }

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
        <WrapperSection>
            <div>Vendor Destribution</div>
            <ReactApexChart options={chartData.options}
                            series={chartData.series}
                            type="treemap"
                            height={350} />
        </WrapperSection>
    );
}

const WrapperSection = styled.div`
  div{
    color: #000000;
  }
  padding: 40px;
  display: block;
  background-color: #ffffff;
  align-items: center;
  gap: 16px;
  flex: 100%;
  font-size: 20px;
  color: #307fe2;
  font-weight: 700;
  line-height: 1;
  .apexcharts-toolbar{
    display: none;
  }

  @media (max-width: 991px) {
    white-space: initial;
  }
    border-radius: 12px;
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
  font-family: Inter, sans-serif;

  &:focus {
    outline: 2px solid #4A90E2;
    outline-offset: 2px;
  }

  @media screen and (max-width: 480px) {
    padding: 16px 16px 32px;
  }
`;

const StatsContainer = styled.section`
  display: flex;
  align-items: center;
  border-radius: 12px;
  background-color: #ffffff;
  gap: 16px;
  flex: 100%;
  font-size: 20px;
  color: #307fe2;
  font-weight: 700;
  height: 460px;
  line-height: 1;

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