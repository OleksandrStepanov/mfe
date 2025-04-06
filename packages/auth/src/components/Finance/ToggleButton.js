import * as React from 'react';
import styled from 'styled-components';

export function ToggleButton({ activeView, onViewChange }) {
    const handleKeyPress = (view, e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onViewChange(view);
        }
    };

    return (
        <Container role="tablist" aria-label="Transaction type selector">
            <Button
                role="tab"
                aria-selected={activeView === 'deposits'}
                tabIndex={activeView === 'deposits' ? 0 : -1}
                onClick={() => onViewChange('deposits')}
                onKeyDown={(e) => handleKeyPress('deposits', e)}
            >
                Deposits
            </Button>
            <Button
                role="tab"
                aria-selected={activeView === 'withdrawals'}
                tabIndex={activeView === 'withdrawals' ? 0 : -1}
                onClick={() => onViewChange('withdrawals')}
                onKeyDown={(e) => handleKeyPress('withdrawals', e)}
            >
                Withdrawals
            </Button>
        </Container>
    );
}

const Container = styled.div`
  border-radius: 4px;
  background-color: rgba(243, 246, 249, 1);
  display: flex;
  margin-top: 18px;
  width: 100%;
  gap: 8px;
  padding: 4px;
`;

const Button = styled.button`
  border-radius: 4px;
  background-color: ${props => props['aria-selected'] ? 'white' : 'transparent'};
  box-shadow: ${props => props['aria-selected'] ? '0px 0px 4px rgba(0, 0, 0, 0.1)' : 'none'};
  min-height: 34px;
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  padding: 9px 8px;
  transition: all 0.2s ease-in-out;
  color: var(--dark-text, #302d34);

  &:focus {
    outline: 2px solid #00239c;
    outline-offset: 2px;
  }

  &:hover {
    background-color: ${props => props['aria-selected'] ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  }
`;