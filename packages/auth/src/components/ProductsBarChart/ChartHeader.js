import styled from "styled-components";
import * as React from "react";

export function ChartHeader() {
    return (
        <HeaderContainer>
            <ChartTitle>Turnover, NGR, GGR</ChartTitle>
            <GroupingDropdown role="button" tabIndex="0">
                <DropdownText>Group by Hours</DropdownText>
                <DropdownIcon
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/7026a23450f948c886940fbe4a74a722/db417e6ab8d50d0da632a274fe44f5064720b52ca05e7c05753548e598a01917?apiKey=7026a23450f948c886940fbe4a74a722&"
                    alt=""
                />
            </GroupingDropdown>
        </HeaderContainer>
    );
}

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