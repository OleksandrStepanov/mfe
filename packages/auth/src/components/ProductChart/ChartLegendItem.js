import styled from "styled-components";
import * as React from "react";

export function ChartLegendItem({ isChecked, label, activeIcon, inactiveIcon, onToggle }) {
    return (
        <LegendItem
            role="checkbox"
            aria-checked={isChecked}
            tabIndex={0}
            onClick={onToggle}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onToggle();
                }
            }}
            $isChecked={isChecked}
        >
            <LegendIcon
                loading="lazy"
                src={isChecked ? activeIcon : inactiveIcon}
                alt=""
                aria-hidden="true"
            />
            <LegendLabel>{label}</LegendLabel>
        </LegendItem>
    );
}

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: start;
  cursor: pointer;
  opacity: ${props => props.$isChecked ? 1 : 0.5};

  &:focus {
    outline: 2px solid var(--focus-color, #4A90E2);
    outline-offset: 2px;
  }

  @media (max-width: 1200px) {
    opacity: ${props => props.$isChecked ? 1 : 0.5};
  }
`;

const LegendIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 16px;
  align-self: stretch;
  margin: auto 0;
`;

const LegendLabel = styled.span`
  font-variant-numeric: lining-nums proportional-nums;
  align-self: stretch;
  margin: auto 0;
`;