import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import moment from "moment";
import ReactApexChart from 'react-apexcharts';
import allMockAPIs from "./../MockAPI";
import formatNumberWithCommas from "./../utils";

export default function BalanceCard({ data, auth }) {
    const [realMoneyChecked, setRealMoneyChecked] = useState(true);
    const [bonusMoneyChecked, setBonusMoneyChecked] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [resultPlayerBalances, setResultPlayerBalances] = useState(allMockAPIs().rep_cross_product_dashboard_player_balances.result);

    const [series, setSeries] = useState(() => {
        const initialData = calculateChartData(
            resultPlayerBalances,
            realMoneyChecked,
            bonusMoneyChecked
        );
        return initialData;
    });

    useEffect(() => {
        if (!auth || !auth.Signature || !auth.UserIp || !auth.Endpoint) {
            console.warn("Auth headers missing, waiting for authentication...");
            return; // Exit effect early if auth is not ready
        }
        console.log(auth, 'auth')
        const fetchData = async () => {
            try {
                setIsLoading(true); // Set loading to true before API call
                console.log(auth, 'auth');
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
                const result = await fetch(`${auth.Endpoint}?resourceName=rep_cross_product_dashboard_player_balances&namespace=datawarehouse`, requestOptions);
                const resultJson = await result.json();
                setResultPlayerBalances(resultJson.result);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false); // Set loading to false after API call completes
            }
        }

        fetchData();
    }, [data, auth]);

    const [chartOptions, setChartOptions] = useState(() => ({
        series: [
            Number(resultPlayerBalances[0].balance_bonus_money).toFixed(0),
            Number(resultPlayerBalances[0].balance_real_money).toFixed(0)
        ],
        options: {
            chart: {
                width: 200,
                type: 'donut',
            },
            colors: [realMoneyChecked ? '#7191FF' : '', bonusMoneyChecked ? '#0033E3' : ''],
            dataLabels: {
                enabled: false
            },
            responsive: [{
                breakpoint: 180,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        show: false
                    }
                }
            }],
            legend: {
                show: false
            }
        },
    }));

    useEffect(() => {
        const updatedData = calculateChartData(
            resultPlayerBalances,
            realMoneyChecked,
            bonusMoneyChecked
        );
        setSeries(updatedData);
        setChartOptions({
            series: updatedData, // Use the calculated series data
            options: {
                chart: {
                    width: 100,
                    type: 'donut',
                },
                colors: [realMoneyChecked ? '#7191FF' : '', bonusMoneyChecked ? '#0033E3' : ''],
                dataLabels: {
                    enabled: false
                },
                responsive: [{
                    breakpoint: 100,
                    options: {
                        chart: {
                            width: 100
                        },
                        legend: {
                            show: false
                        }
                    }
                }],
                legend: {
                    show: false,
                    position: 'bottom'
                }
            },
        });
    }, [realMoneyChecked, bonusMoneyChecked]);

    const handleRealMoneyChange = () => {
        setRealMoneyChecked(!realMoneyChecked);
    };

    const handleBonusMoneyChange = () => {
        setBonusMoneyChecked(!bonusMoneyChecked);
    };

    const totalBalance =
        (realMoneyChecked
            ? Number(resultPlayerBalances[0].balance_real_money)
            : 0) +
        (bonusMoneyChecked
            ? Number(resultPlayerBalances[0].balance_bonus_money)
            : 0);

    if (isLoading) {
        return (
            <StatsLoaderContainer>
                <LoadingSpinner /> {/* Create this component for your loader */}
            </StatsLoaderContainer>
        );
    }
    return (
        <Card
            role="region"
            aria-label="Balance Information"
            aria-live="polite"
        >
            <Header role="banner">
                <Icon
                    src="https://cdn.builder.io/api/v1/image/assets/7026a23450f948c886940fbe4a74a722/a8527c2e6c8e117dfeb5c28b3235583165b1bf4c841050b2cb0a2abd7234c9df?apiKey=7026a23450f948c886940fbe4a74a722&"
                    alt="Balance icon"
                    loading="lazy"
                />
                <Title tabIndex="0">Balances</Title>
            </Header>
            <StatsContainer role="complementary" aria-label="Balance Statistics">
                <TotalBalanceSection>
                    <Amount tabIndex="0" aria-label="Total Balance Amount">
                        €{formatNumberWithCommas(totalBalance)}
                    </Amount>
                    <Label className="description" tabIndex="0">Total Balance</Label>
                </TotalBalanceSection>
                <ApexChartWrapper>
                    <ReactApexChart
                        type="donut"
                        options={chartOptions}
                        series={series}
                        width={100}
                    />
                </ApexChartWrapper>
                <div>
                    <div>
                        <input
                            type="checkbox"
                            checked={realMoneyChecked}
                            onChange={handleRealMoneyChange}
                            style={{ marginRight: '10px' }}
                        />
                        <label style={{ fontWeight: 'normal', cursor: 'pointer', color: '#302d34' }}>Real Money</label>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            checked={bonusMoneyChecked}
                            onChange={handleBonusMoneyChange}
                            style={{ marginRight: '10px' }}
                        />
                        <label style={{ fontWeight: 'normal', cursor: 'pointer', color: '#302d34' }}>Bonus Money</label>
                    </div>
                </div>
            </StatsContainer>
        </Card>
    );
}

function calculateChartData(data, includeReal, includeBonus) {
    const result = [];

    if (includeReal) {
        result.push(data.map(item => parseFloat(item.balance_real_money)));
    }

    if (includeBonus) {
        result.push(data.map(item => parseFloat(item.balance_bonus_money)));
    }

    return result.flat();
}

const StatsLoaderContainer = styled.section`
  border-radius: 12px;
  background: var(--text-0, #fff);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  font-family: Inter, sans-serif;
  outline: none;
  height: 188px;
  flex: 49%
`;

const Card = styled.section`
  border-radius: 12px;
  background: var(--text-0, #fff);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  font-family: Inter, sans-serif;
  outline: none;
  height: 188px;
  flex: 49%;
  
  &:focus-visible {
    outline: 2px solid #00239c;
    outline-offset: 2px;
  }
`;

const Header = styled.header`
  display: flex;
  width: 281px;
  max-width: 100%;
  align-items: center;
  gap: 16px;
  font-size: 20px;
  color: #00239c;
  font-weight: 700;
  text-align: center;
  line-height: 1;
  padding-top: 20px;
  
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const Icon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  border-radius: 4px;
  margin: auto 0;
  padding-left: 20px;
`;

const Title = styled.h1`
  font-variant-numeric: lining-nums proportional-nums;
  margin: auto 0;
  font-size: inherit;
  
  &:focus-visible {
    outline: 2px solid #00239c;
    outline-offset: 2px;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  min-height: 67px;
  width: 100%;
  align-items: center;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const TotalBalanceSection = styled.div`
  display: flex;
  width: 238px;
  flex-direction: column;
  color: var(--dark-text, #302d34);
  font-weight: 400;
  text-align: center;
  margin: 10px 0;
`;

const Amount = styled.p`
  font-size: 32px;
  margin: 0;

  &:focus-visible {
    outline: 2px solid #00239c;
    outline-offset: 2px;
  }
`;

const Label = styled.p`
  font-size: 16px;
  margin-top: 5px;

  &:focus-visible {
    outline: 2px solid #00239c;
    outline-offset: 2px;
  }
`;

const ApexChartWrapper = styled.div`
  .apexcharts-legend{
    display:none;
  }
  .apexcharts-datalabels{
    display:none;
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