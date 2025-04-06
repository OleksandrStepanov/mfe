import * as React from "react";
import styled from "styled-components";

function StatCard({ value, label, ariaLabel }) {
    return (
        <StatContainer role="article" aria-label={ariaLabel}>
            <StatValue>{value}</StatValue>
            <StatLabel>{label}</StatLabel>
        </StatContainer>
    );
}

const StatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  flex-basis: 0%;
  border-radius: 8px;

  &:focus-within {
    outline: 2px solid #307fe2;
    outline-offset: 2px;
  }

  // @media screen and (prefers-reduced-motion: no-preference) {
  //   transition: transform 0.2s ease-in-out;
  // }
  //
  // &:hover {
  //   transform: translateY(-2px);
  // }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 400;
  color: var(--dark-text, #302d34);
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: var(--dark-text, #302d34);
`;

export default StatCard;