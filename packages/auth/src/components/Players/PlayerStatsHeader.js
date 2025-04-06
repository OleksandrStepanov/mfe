import * as React from "react";
import styled from "styled-components";

function PlayerStatsHeader() {
    return (
        <HeaderSection>
            <StatsIcon
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/7026a23450f948c886940fbe4a74a722/87cf5d31bcf16303de9ca055ae6d6e5721b1869b4af7090ff883817f5f59c621?apiKey=7026a23450f948c886940fbe4a74a722&"
                alt="Players statistics icon"
                aria-hidden="true"
            />
            <StatsTitle>Players</StatsTitle>
        </HeaderSection>
    );
}

const HeaderSection = styled.header`
  display: flex;
  align-items: center;
  padding-top: 20px;
  gap: 16px;
  font-size: 20px;
  color: #307fe2;
  font-weight: 700;
  line-height: 1;

  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const StatsIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  padding-left: 20px;
  object-position: center;
  border-radius: 4px;
`;

const StatsTitle = styled.h1`
  font-variant-numeric: lining-nums proportional-nums;
  margin: 0;
  font-size: 20px;
  color: inherit;
`;

export default PlayerStatsHeader;