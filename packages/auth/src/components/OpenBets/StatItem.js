import * as React from "react";
import styled from "styled-components";

export function StatItem({ value, label, index }) {
    return (
        <StatContainer
            role="group"
            aria-label={`${label}: ${value}`}
            tabIndex="0"
        >
            <StatValue aria-hidden="true">{value}</StatValue>
            <StatLabel aria-hidden="true">{label}</StatLabel>
        </StatContainer>
    );
}

const StatContainer = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: start;
  flex: 1;
  flex-basis: 0%;
  margin: auto 0;
  min-width: 120px;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:focus {
    outline: 2px solid #4A90E2;
    outline-offset: 2px;
    background-color: rgba(74, 144, 226, 0.1);
  }

  @media (hover: hover) {
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: var(--dark-text, #302d34);
  margin-bottom: 4px;

  @media screen and (max-width: 480px) {
    font-size: 28px;
  }
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: var(--dark-text, #302d34);
  opacity: 0.8;

  @media screen and (max-width: 480px) {
    font-size: 14px;
  }
`;