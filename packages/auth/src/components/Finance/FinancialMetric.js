import * as React from 'react';
import styled from 'styled-components';

export function FinancialMetric({ label, value, id }) {
    return (
        <MetricContainer>
            <MetricLabel id={`${id}-label`}>{label}</MetricLabel>
            <MetricValue aria-labelledby={`${id}-label`}>{value}</MetricValue>
        </MetricContainer>
    );
}

const MetricContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  margin-bottom: 4px;

  @media (max-width: 991px) {
    padding: 0 20px;
  }
`;

const MetricLabel = styled.span`
  font-size: 16px;
  color: var(--dark-text, #302d34);
`;

const MetricValue = styled.span`
  font-size: 32px;
  color: var(--dark-text, #302d34);
`;