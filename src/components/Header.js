import React from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../context/Web3Context';
import { shortenAddress } from '../utils/helpers';

const Header = () => {
  const { account, isConnected, connectWallet, disconnectWallet, isConnecting } = useWeb3();

  return (
    <HeaderContainer>
      <Logo>
        <LogoText>HatchToken Launcher</LogoText>
      </Logo>
      <Navigation>
        {!isConnected ? (
          <ConnectButton onClick={connectWallet} disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </ConnectButton>
        ) : (
          <AccountContainer>
            <AccountBadge>
              {shortenAddress(account)}
            </AccountBadge>
            <DisconnectButton onClick={disconnectWallet}>
              Disconnect
            </DisconnectButton>
          </AccountContainer>
        )}
      </Navigation>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: rgba(22, 22, 50, 0.6);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  background: linear-gradient(135deg, #7e78f2 0%, #27b0e6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
`;

const ConnectButton = styled.button`
  background: linear-gradient(135deg, #7e78f2 0%, #27b0e6 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  border-radius: 50px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 15px rgba(126, 120, 242, 0.5);
  }

  &:disabled {
    background: #4a4a6a;
    cursor: not-allowed;
  }
`;

const DisconnectButton = styled.button`
  background-color: #3a3a5e;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  border-radius: 50px;
  margin-left: 1rem;

  &:hover {
    background-color: #4a4a7e;
  }
`;

const AccountContainer = styled.div`
  display: flex;
  align-items: center;
`;

const AccountBadge = styled.div`
  background-color: #2a2a4a;
  color: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  border: 1px solid #3e3e6e;
`;

export default Header;