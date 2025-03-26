import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import Header from './components/Header';
import TokenLaunch from './components/TokenLaunch';
import NetworkSwitcher from './components/NetworkSwitcher';
import { Web3Provider } from './context/Web3Context';
import GlobalStyle from './styles/GlobalStyle';

function App() {
  return (
    <Web3Provider>
      <GlobalStyle />
      <AppContainer>
        <Header />
        <MainContent>
          <NetworkSwitcher />
          <TokenLaunch />
        </MainContent>
        <ToastContainer position="bottom-right" />
      </AppContainer>
    </Web3Provider>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export default App;