import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { FinancialMetric } from './FinancialMetric';
import { ToggleButton } from './ToggleButton';
import formatNumberWithCommasNumber from "./../utils"

const VIEWS = {
    DEPOSITS: 'deposits',
    WITHDRAWALS: 'withdrawals'
};

export default function FinancialPerformanceCard( { sharedData, auth } ) {
    const [activeView, setActiveView] = useState(VIEWS.DEPOSITS);
    const [metrics, setMetrics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [financialData, setFinancialData] = useState(null);

    const createMetricsData = (view, data) => {
        const metrics = {
            [VIEWS.DEPOSITS]: [
                {
                    label: 'Deposits',
                    value: formatNumberWithCommasNumber(data.deposit_cnt),
                    id: 'deposits-metric'
                },
                {
                    label: 'Deposit Amount',
                    value: `€${formatNumberWithCommasNumber(data.deposit_amount)}`,
                    id: 'deposit-amount-metric'
                },
                {
                    label: 'Average Deposit Amount',
                    value: `€${formatNumberWithCommasNumber(data.deposit_amount_average)}`,
                    id: 'avg-deposit-metric'
                }
            ],
            [VIEWS.WITHDRAWALS]: [
                {
                    label: 'Withdrawals',
                    value: formatNumberWithCommasNumber(data.withdrawals_cnt),
                    id: 'withdrawals-metric'
                },
                {
                    label: 'Withdrawal Amount',
                    value: `€${formatNumberWithCommasNumber(data.withdrawal_amount)}`,
                    id: 'withdrawal-amount-metric'
                },
                {
                    label: 'Average Withdrawal Amount',
                    value: `€${formatNumberWithCommasNumber(data.withdrawal_amount_average)}`,
                    id: 'avg-withdrawal-metric'
                }
            ]
        };

        return metrics[view] || [];
    };

    const fetchFinancialData = async () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Signature': auth.Signature,
                'ubo-user-ip': auth.UserIp
            },
            body: JSON.stringify({
                p_report_params: {
                    p_currency_code: [],
                    p_date_from: sharedData && sharedData.dates[0] ? moment(sharedData.dates[0]).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
                    p_date_to: sharedData && sharedData.dates[1] ? moment(sharedData.dates[1]).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
                    p_domains: sharedData.domains ? sharedData.domains : [2319],
                    p_execution_type: "report",
                    p_report_currency: "EUR",
                    p_template_name: null
                }
            })
        };

        const response = await fetch(`${auth.Endpoint}?resourceName=rep_cross_product_dashboard_financial&namespace=datawarehouse`, requestOptions);
        return response.json();
    };

    useEffect(() => {
        if (!auth || !auth.Signature || !auth.UserIp || !auth.Endpoint) {
            console.warn("Auth headers missing, waiting for authentication...");
            return; // Exit effect early if auth is not ready
        }
        loadFinancialData();
    }, [sharedData, auth]);

    useEffect(() => {
        if (financialData) {
            updateMetrics(activeView);
        }
    }, [activeView, financialData]);

    const loadFinancialData = async () => {
        try {
            setIsLoading(true);
            const res = await fetchFinancialData();
            setFinancialData(res.result[0]);
        } catch (error) {
            console.error('Error fetching financial data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateMetrics = (view) => {
        if (!financialData) return;
        const newMetrics = createMetricsData(view, financialData);
        setMetrics(newMetrics);
    };

    if (isLoading) {
        return (
            <StatsContainer>
                <LoadingSpinner />
            </StatsContainer>
        );
    }

    return (
        <Card
            role="region"
            aria-label="Financial Performance Dashboard"
        >
            <Header>
                <Icon
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/7026a23450f948c886940fbe4a74a722/e2e961eb292678cabe08cb8d151f3abe4a1be08633e03971762e259f141693ff?apiKey=7026a23450f948c886940fbe4a74a722&"
                    alt="Financial Performance Icon"
                />
                <Title>Financial Performance</Title>
            </Header>

            <ToggleButton
                activeView={activeView}
                onViewChange={setActiveView}
            />

            <MetricsContainer>
                <MetricsGroup>
                    {metrics.map((metric) => (
                        <FinancialMetric
                            key={metric.id}
                            label={metric.label}
                            value={metric.value}
                            id={metric.id}
                        />
                    ))}
                </MetricsGroup>

                <Divider role="separator" aria-hidden="true" />
                <Container>
                    <MainMetric>
                        <Value aria-label="Net Cash">€{formatNumberWithCommasNumber(financialData.net_cash)}</Value>
                        <Label>Net Cash</Label>
                    </MainMetric>

                    <RatioCard>
                        <RatioBox role="status" aria-label="Net Cash to Deposit Ratio">
                            <RatioValue>{financialData.net_cash_to_deposit}%</RatioValue>
                            <RatioLabel>Net Cash to Deposit Ratio</RatioLabel>
                        </RatioBox>
                    </RatioCard>
                </Container>
            </MetricsContainer>
        </Card>
    );
}

const Card = styled.section`
  flex: 31%;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  font-family: Inter, sans-serif;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
`;

const Icon = styled.img`
  border-radius: 4px;
  object-fit: contain;
  padding-left: 20px;
`;

const Title = styled.h1`
  font-size: 20px;
  color: #00239c;
  font-weight: 700;
  margin: 0;
`;

const MetricsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetricsGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Divider = styled.hr`
  height: 1px;
  margin: 16px 0;
  border: none;
  background-color: rgba(223, 228, 238, 1);
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

const StatsContainer = styled.div`
  display: flex;
  flex: 31%;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  align-items: center;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const Container = styled.div`
  display: flex;
  gap: 69px;
  justify-content: space-between;
  padding: 10px 40px;

  @media (max-width: 991px) {
    padding: 0 20px;
    flex-wrap: wrap;
    gap: 40px;
  }
`;

const MainMetric = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--dark-text, #302d34);
`;

const Value = styled.span`
  font-size: 32px;
  font-weight: 500;
`;

const Label = styled.span`
  font-size: 16px;
`;

const RatioCard = styled.div`
  width: 181px;
  margin-top: 0;
`;

const RatioBox = styled.div`
  border-radius: 12px;
  background-color: rgba(224, 231, 255, 1);
  height: 67px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RatioValue = styled.span`
  color: rgba(0, 35, 156, 1);
  font-size: 16px;
  font-weight: 800;
`;

const RatioLabel = styled.span`
  color: rgba(95, 102, 108, 1);
  font-size: 12px;
  font-weight: 600;
  text-align: center;
`;