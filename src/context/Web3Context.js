import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { MONAD_TESTNET, SEPOLIA } from '../constants/networks';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask is not installed! Please install MetaMask first.');
      return;
    }

    try {
      setIsConnecting(true);
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const accounts = await ethProvider.listAccounts();
      const network = await ethProvider.getNetwork();
      
      setProvider(ethProvider);
      setSigner(ethProvider.getSigner());
      setAccount(accounts[0]);
      setChainId(network.chainId);
      setIsConnected(true);
      
      toast.success('Wallet connected!');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    toast.info('Wallet disconnected');
  };

  const switchToMonadTestnet = async () => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.utils.hexValue(MONAD_TESTNET.chainId) }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: ethers.utils.hexValue(MONAD_TESTNET.chainId),
                chainName: MONAD_TESTNET.name,
                nativeCurrency: MONAD_TESTNET.nativeCurrency,
                rpcUrls: MONAD_TESTNET.rpcUrls,
                blockExplorerUrls: MONAD_TESTNET.blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Monad Testnet:', addError);
          toast.error('Failed to add Monad Testnet to MetaMask');
        }
      } else {
        console.error('Error switching to Monad Testnet:', switchError);
        toast.error('Failed to switch to Monad Testnet');
      }
    }
  };

  const checkIfCorrectNetwork = () => {
    return chainId === MONAD_TESTNET.chainId || chainId === SEPOLIA.chainId;
  };
  
  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;
    
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account]);

  // Try to connect on first load if MetaMask is already authorized
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await ethProvider.listAccounts();
          
          if (accounts.length > 0) {
            const network = await ethProvider.getNetwork();
            setProvider(ethProvider);
            setSigner(ethProvider.getSigner());
            setAccount(accounts[0]);
            setChainId(network.chainId);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Auto-connection error:', error);
        }
      }
    };
    
    checkConnection();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        chainId,
        isConnecting,
        isConnected,
        connectWallet,
        disconnectWallet,
        switchToMonadTestnet,
        checkIfCorrectNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}