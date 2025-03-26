import React from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../context/Web3Context';
import { MONAD_TESTNET } from '../constants/networks';

const NetworkSwitcher = () => {
  const { chainId, switchToMonadTestnet, isConnected } = useWeb3();
  
  const isCorrectNetwork = chainId === MONAD_TESTNET.chainId;

  if (!isConnected) return null;
  
  return (
    <NetworkContainer>
      {!isCorrectNetwork ? (
        <NetworkAlert>
          <p>You're not connected to Monad Testnet</p>
          <SwitchButton onClick={switchToMonadTestnet}>
            Switch to Monad Testnet
          </SwitchButton>
        </NetworkAlert>
      ) : (
        <NetworkIndicator>
          <NetworkDot />
          <span>Connected to Monad Testnet</span>
        </NetworkIndicator>
      )}
    </NetworkContainer>
  );
};

const NetworkContainer = styled.div`
  margin-bottom: 2rem;
`;

const NetworkAlert = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 159, 67, 0.15);
  border-left: 4px solid #ff9f43;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;

  p {
    margin: 0;
    color: #ff9f43;
    font-weight: 500;
  }
`;

const SwitchButton = styled.button`
  background-color: #ff9f43;
  color: #1a1a2e;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background-color: #ffa753;
    transform: translateY(-2px);
  }
`;

const NetworkIndicator = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(59, 222, 128, 0.15);
  border-left: 4px solid #3bde80;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const NetworkDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #3bde80;
  margin-right: 10px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #3bde80;
    top: -5px;
    left: -5px;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.8;
    }
    70% {
      transform: scale(1.3);
      opacity: 0;
    }
    100% {
      transform: scale(0.8);
      opacity: 0;
    }
  }
`;

export default NetworkSwitcher;