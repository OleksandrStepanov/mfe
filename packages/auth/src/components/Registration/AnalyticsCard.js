import React, {useEffect, useState} from "react";
import styled from "styled-components";
import moment from 'moment';
import ReactApexChart from "react-apexcharts";
import allMockAPIs from "../MockAPI";

export default function RegisteredDepositedCard({ data, auth }) {
    const [isLoading, setIsLoading] = useState(true);
    const [resultPlayerRegistration, setResultPlayerRegistration] = useState(allMockAPIs().rep_cross_product_dashboard_registration.result);

    const [state, setState] = React.useState({

        series: [{
            data: [
                resultPlayerRegistration[0].first_depositors_cnt,
                resultPlayerRegistration[0].registered_and_deposited_cnt
            ]
        }],
        options: {
            chart: {
                type: 'bar',
                height: 200
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    borderRadiusApplication: 'end',
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: true
            },
            xaxis: {
                categories: ['First Depositors', 'Registered and Deposited'],
                axisBorder: {
                    show: false,
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
    }, [data, auth]);

    if (isLoading) {
        return (
            <StatsLoaderContainer>
                <LoadingSpinner /> {/* Create this component for your loader */}
            </StatsLoaderContainer>
        );
    }

    return (
        <Card role="region" aria-label="Analytics Dashboard">
            <Header>
                <Icon
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/7026a23450f948c886940fbe4a74a722/ef5a11a18c182d3daa0ebc2c4949207e55790a11db0b10fbe816ff97414a4083?apiKey=7026a23450f948c886940fbe4a74a722&"
                    alt="Analytics icon"
                    role="img"
                />
                <Title>Registered and Deposited</Title>
            </Header>
            <Content>
                <StatsRegisterContainer>
                    <ReactApexChart options={state.options} series={state.series} type="bar" height={130} />
                </StatsRegisterContainer>
                <Container>
                    <Box>
                        <Percentage>{resultPlayerRegistration[0].conversion_rate}%</Percentage>
                        <Label>Conversion Rate</Label>
                    </Box>
                </Container>
            </Content>
        </Card>
    );
}

const Card = styled.section`
  height: 188px;
  border-radius: 12px;
  background: var(--text-0, #fff);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  flex: 48%;
  font-family: Inter, sans-serif;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding-top: 20px;
  gap: 16px;
`;

const Icon = styled.img`
  padding-left: 20px;
  border-radius: 4px;
  object-fit: contain;
`;

const Title = styled.h2`
  font-size: 20px;
  color: #307fe2;
  font-weight: 700;
  margin: 0;
`;

const Content = styled.div`
  display: flex;
  gap: 20px 20px;
  flex-wrap: wrap;
  justify-content: space-around;

  @media (max-width: 991px) {
    padding-right: 20px;
  }
`;

const StatsLoaderContainer = styled.section`
  border-radius: 12px;
  background: var(--text-0, #fff);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  flex: 49%;
  height: 188px;
  flex-direction: column;
  font-family: Inter, sans-serif;
  text-align: center;
`;

const StatsRegisterContainer = styled.section`
  border-radius: 12px;
  background: var(--text-0, #fff);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  flex: 49%;
  height: 110px;
  width: 200px;
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
   .apexcharts-toolbar{
    display:none;
  }
  .apexcharts-xaxis-texts-g{
    display:none;
  }
  .apexcharts-text{
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
  }
`;

const Container = styled.div`
  display: flex;
  text-align: center;
  justify-content: space-between;
  width: 128px;
  margin-top: 30px;
`;

const Box = styled.div`
  border-radius: 12px;
  background-color: rgba(228, 238, 251, 1);
  display: flex;
  height: 67px;
  width: 100%;
  flex-direction: column;
`;

const Percentage = styled.div`
  padding-top: 16px;
  color: rgba(48, 127, 226, 1);
  font-size: 16px;
  font-weight: 800;
`;

const Label = styled.div`
  color: rgba(95, 102, 108, 1);
  font-size: 12px;
  font-weight: 600;
  align-self: center;
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