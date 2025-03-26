import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useWeb3 } from '../context/Web3Context';
import { 
  BONDING_CONTRACT_ADDRESS, 
  BONDING_CONTRACT_ABI,
  ASSET_TOKEN_ADDRESS,
  ASSET_TOKEN_ABI,
  TOKEN_ABI
} from '../constants/networks';
import { formatNumber, formatError } from '../utils/helpers';

const TokenLaunch = () => {
  const { isConnected, signer, account, checkIfCorrectNetwork, provider } = useWeb3();
  
  // Token launch form
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [tokenImageUrl, setTokenImageUrl] = useState('');
  const [tokenWebsite, setTokenWebsite] = useState('');
  const [tokenTwitter, setTokenTwitter] = useState('');
  const [tokenGithub, setTokenGithub] = useState('');
  const [tokenDiscord, setTokenDiscord] = useState('');
  // Default cores for AI model - can make this configurable if needed
  const [tokenCores] = useState([1, 2, 3]); 
  const [purchaseAmount, setPurchaseAmount] = useState('');
  
  // Contract interactions
  const [bondingContract, setBondingContract] = useState(null);
  const [assetToken, setAssetToken] = useState(null);
  const [tokenFee, setTokenFee] = useState('0');
  const [assetBalance, setAssetBalance] = useState('0');
  const [assetApproved, setAssetApproved] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [deployedTokens, setDeployedTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0');
  
  // Add a specific loading state for token fetching
  const [fetchingTokens, setFetchingTokens] = useState(false);
  
  // Add these new state variables
  const [buyEstimate, setBuyEstimate] = useState(null);
  const [sellEstimate, setSellEstimate] = useState(null);
  
  // Initialize contracts
  useEffect(() => {
    if (isConnected && signer) {
      try {
        const bondingContractInstance = new ethers.Contract(
          BONDING_CONTRACT_ADDRESS,
          BONDING_CONTRACT_ABI,
          signer
        );
        
        const assetTokenInstance = new ethers.Contract(
          ASSET_TOKEN_ADDRESS,
          ASSET_TOKEN_ABI,
          signer
        );
        
        setBondingContract(bondingContractInstance);
        setAssetToken(assetTokenInstance);
        fetchUserTokens();
        
      } catch (error) {
        console.error('Error initializing contracts:', error);
        toast.error('Failed to initialize contracts');
      }
    }
  }, [isConnected, signer, account]);
  
  // Fetch token fee and user's asset balance
  useEffect(() => {
    const fetchInitialData = async () => {
      if (bondingContract && assetToken && account) {
        try {
          const fee = await bondingContract.fee();
          setTokenFee(ethers.utils.formatEther(fee));
          
          const balance = await assetToken.balanceOf(account);
          setAssetBalance(ethers.utils.formatEther(balance));
          
          // Check if asset token is approved
          const allowance = await assetToken.allowance(account, BONDING_CONTRACT_ADDRESS);
          setAssetApproved(allowance.gt(0));
          
          // Fetch user's tokens
          fetchUserTokens();
        } catch (error) {
          console.error('Error fetching initial data:', error);
          toast.error('Failed to load initial data');
        }
      }
    };
    
    fetchInitialData();
  }, [bondingContract, assetToken, account]);
  
  // Fetch user's tokens using past events
  const fetchUserTokens = async () => {
    try {
      if (!account || !bondingContract) return;
      
      setFetchingTokens(true); // Set loading state to true
      
      // Use the provider from context
      const blockNumber = await provider.getBlockNumber();
      
      const userTokens = await assetToken.balanceOf(account);
      setTokenBalance(ethers.utils.formatEther(userTokens));
      
      // Fetch all Launched events from block number 9538247 till current block in chunks of 100
      const chunkSize = 100;
      const events = [];
      
      let fromBlock = 9538247; // Starting block number
      
      while (fromBlock <= blockNumber) {
        const toBlock = Math.min(fromBlock + chunkSize, blockNumber);
        // Use provider instead of bondingContract for getting current block
        const chunk = await bondingContract.queryFilter("Launched", fromBlock, toBlock);
        events.push(...chunk);
        fromBlock += chunkSize + 1;
        if (fromBlock > blockNumber) break;
      }

      
      const tokenAddresses = [];
      const tokenDetailsArray = [];
      
      // Process events to get token addresses
      for (const event of events) {
        try {
          const tokenAddress = event.args[0];
          
          // Get token info one at a time with error handling
          try {
            const tokenInfo = await bondingContract.tokenInfo(tokenAddress);
            tokenAddresses.push(tokenAddress);
            tokenDetailsArray.push(tokenInfo);
          } catch (tokenError) {
            console.error(`Error fetching info for token ${tokenAddress}:`, tokenError);
            // Continue with the next token
          }
        } catch (eventError) {
          console.error("Error processing event:", eventError);
          // Continue with the next event
        }
      }
      
      // Filter tokens created by this user
      const userTokensFiltered = tokenDetailsArray
        .map((details, index) => {
          try {
            return {
              address: tokenAddresses[index],
              creator: details.creator,
              name: details.data.name,
              symbol: details.data.ticker,
              price: 1 / details.data.price,
              marketCap: ethers.utils.formatEther(details.data.marketCap),
              volume24H: ethers.utils.formatEther(details.data.volume24H),
              trading: details.trading
            };
          } catch (error) {
            console.error(`Error mapping token details for ${tokenAddresses[index]}:`, error);
            return null;
          }
        })
        .filter(token => token !== null && token.creator.toLowerCase() === account.toLowerCase());
      
      setDeployedTokens(userTokensFiltered);
    } catch (error) {
      console.error('Error fetching all tokens:', error);
      toast.error('Failed to load all tokens');
    } finally {
      setFetchingTokens(false); // Set loading state to false when done
    }
  };
  
  // Approve asset token for bonding contract
  const approveAssetToken = async () => {
    if (!assetToken || !account) return;
    
    try {
      setApproving(true);
      
      const maxApproval = ethers.constants.MaxUint256;
      const tx = await assetToken.approve(BONDING_CONTRACT_ADDRESS, maxApproval);
      
      toast.info('Approving asset token...');
      await tx.wait();
      
      setAssetApproved(true);
      toast.success('Asset token approved');
    } catch (error) {
      console.error('Error approving token:', error);
      toast.error(`Approval failed: ${formatError(error)}`);
    } finally {
      setApproving(false);
    }
  };
  
  // Launch a new token
  const launchToken = async () => {
    if (!checkIfCorrectNetwork()) return;
    
    // Validation
    if (!tokenName || !tokenSymbol || !tokenDescription || !purchaseAmount) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Purchase amount validation
    const amountInEther = parseFloat(purchaseAmount);
    const feeInEther = parseFloat(tokenFee);
    
    if (isNaN(amountInEther) || amountInEther <= feeInEther) {
      toast.error(`Purchase amount must be greater than fee (${tokenFee})`);
      return;
    }
    
    if (amountInEther > parseFloat(assetBalance)) {
      toast.error(`Insufficient balance. You have ${assetBalance} tokens`);
      return;
    }
    
    try {
      setLoading(true);
      
      // Approve asset token if not already approved
      if (!assetApproved) {
        await approveAssetToken();
      }
      
      const amountInWei = ethers.utils.parseEther(purchaseAmount);
      
      // Make sure cores is properly formatted as an array of numbers
      const coresArray = tokenCores.map(core => Number(core));
      
      // Simplify parameters to minimize potential issues
      const simplifiedName = tokenName.trim();
      const simplifiedSymbol = tokenSymbol.trim();
      const simplifiedDescription = tokenDescription.trim();
      const simplifiedImage = "";
      
      // Try direct transaction without gas estimation
      const tx = await bondingContract.launch(
        simplifiedName,
        simplifiedSymbol,
        coresArray,
        simplifiedDescription,
        simplifiedImage,
        // links,
        amountInWei,
        { 
          gasLimit: 4000000  // Set a high fixed gas limit
        }
      );
      
      toast.info("Transaction submitted. Waiting for confirmation...");
      
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast.success("Token launched successfully!");
        
        // Refresh deployed tokens
        fetchUserTokens();
        
        // Reset form
        resetForm();
      } else {
        toast.error("Transaction failed on-chain");
      }
    } catch (error) {
      console.error("Error launching token:", error);
      toast.error(`Error: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Select a token for trading
  const selectTokenForTrading = async (tokenAddress) => {
    if (!bondingContract || !account) return;
    
    try {
      // Get token details
      const details = await bondingContract.tokenInfo(tokenAddress);
      
      // Create token contract
      const tokenContract = new ethers.Contract(tokenAddress, TOKEN_ABI, signer);
      
      // Get user's token balance
      const balance = await tokenContract.balanceOf(account);
      
      setSelectedToken({
        address: tokenAddress,
        name: details.data.name,
        symbol: details.data.ticker,
        price: 1/ details.data.price,
        marketCap: ethers.utils.formatEther(details.data.marketCap),
        volume24H: ethers.utils.formatEther(details.data.volume24H),
        balance: ethers.utils.formatEther(balance),
        contract: tokenContract,
        trading: details.trading
      });
      
      setTokenBalance(ethers.utils.formatEther(balance));
      setTradeAmount('');
    } catch (error) {
      console.error('Error selecting token:', error);
      toast.error('Failed to load token details');
    }
  };
  
  // Buy tokens
  const buyTokens = async () => {
    if (!bondingContract || !selectedToken || !tradeAmount) return;
    
    try {
      setLoading(true);
      
      // Convert amount to Wei
      const amountWei = ethers.utils.parseEther(tradeAmount);
      
      // First check if we need to approve the asset token for the ROUTER address
      const routerAddress = await bondingContract.router();
      
      const allowance = await assetToken.allowance(account, routerAddress);
      if (allowance.lt(amountWei)) {
        toast.info('Approving asset token for router...');
        const approveTx = await assetToken.approve(routerAddress, ethers.constants.MaxUint256);
        await approveTx.wait();
        toast.success('Asset token approved for router');
      }
      
      // Buy tokens with explicit gas limit
      toast.info('Buying tokens...');
      
      const tx = await bondingContract.buy(
        amountWei, 
        selectedToken.address,
        { 
          gasLimit: 500000 // Set a high fixed gas limit
        }
      );
      
      await tx.wait();
      
      toast.success('Tokens purchased successfully!');
      
      // Refresh asset balance
      const assetBalance = await assetToken.balanceOf(account);
      setAssetBalance(ethers.utils.formatEther(assetBalance));
      
      // Refresh token info and update the token in the list
      await updateSelectedTokenInfo();
      
      setTradeAmount('');
    } catch (error) {
      console.error('Error buying tokens:', error);
      toast.error(`Purchase failed: ${formatError(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Sell tokens
  const sellTokens = async () => {
    if (!bondingContract || !selectedToken || !tradeAmount) return;
    
    try {
      setLoading(true);
      
      const amountWei = ethers.utils.parseEther(tradeAmount);
      
      // Get router address for approval
      const routerAddress = await bondingContract.router();
      
      // First approve the token for the router with max approval
      const allowance = await selectedToken.contract.allowance(account, routerAddress);
      if (allowance.lt(amountWei)) {
        toast.info('Approving token for sale...');
        const approveTx = await selectedToken.contract.approve(routerAddress, ethers.constants.MaxUint256);
        await approveTx.wait();
        toast.success('Token approved for sale');
      }
      
      // Sell tokens with explicit gas limit
      toast.info('Selling tokens...');
      
      const tx = await bondingContract.sell(
        amountWei, 
        selectedToken.address,
        { 
          gasLimit: 500000 // Set a high fixed gas limit
        }
      );
      
      await tx.wait();
      
      toast.success('Tokens sold successfully!');
      
      // Refresh asset balance
      const assetBalance = await assetToken.balanceOf(account);
      setAssetBalance(ethers.utils.formatEther(assetBalance));
      
      // Refresh token info and update the token in the list
      await updateSelectedTokenInfo();
      
      setTradeAmount('');
    } catch (error) {
      console.error('Error selling tokens:', error);
      toast.error(`Sale failed: ${formatError(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to update just the selected token info
  const updateSelectedTokenInfo = async () => {
    if (!selectedToken || !bondingContract) return;
    
    try {
      // Get updated token details
      const details = await bondingContract.tokenInfo(selectedToken.address);
      
      // Get user's token balance
      const balance = await selectedToken.contract.balanceOf(account);
      
      // Update selected token
      const updatedToken = {
        ...selectedToken,
        price: 1 / details.data.price,
        marketCap: ethers.utils.formatEther(details.data.marketCap),
        volume24H: ethers.utils.formatEther(details.data.volume24H),
        balance: ethers.utils.formatEther(balance)
      };
      
      setSelectedToken(updatedToken);
      setTokenBalance(ethers.utils.formatEther(balance));
      
      // Update the token in the deployedTokens array
      setDeployedTokens(prevTokens => 
        prevTokens.map(token => 
          token.address === selectedToken.address 
            ? {
                ...token,
                price: 1 / details.data.price,
                marketCap: ethers.utils.formatEther(details.data.marketCap),
                volume24H: ethers.utils.formatEther(details.data.volume24H)
              }
            : token
        )
      );
    } catch (error) {
      console.error('Error updating token info:', error);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setTokenName('');
    setTokenSymbol('');
    setTokenDescription('');
    setTokenImageUrl('');
    setTokenWebsite('');
    setTokenTwitter('');
    setTokenGithub('');
    setTokenDiscord('');
    setPurchaseAmount('');
  };
  
  // Add this function to calculate price impact using the token price from tokenInfo
  const calculateTradeEstimate = async (amount, isBuy) => {
    if (!bondingContract || !selectedToken || !amount || parseFloat(amount) <= 0) {
      setBuyEstimate(null);
      setSellEstimate(null);
      return;
    }
    
    try {
      // Get the latest token info to ensure we have the current price
      const tokenInfo = await bondingContract.tokenInfo(selectedToken.address);
      const currentPrice = 1 / tokenInfo.data.price; 
    
        const tokensOutBuy = amount / (currentPrice);
        setBuyEstimate({
          tokensOut: tokensOutBuy
        });

        const tokensOutSell = amount * (currentPrice);
        setSellEstimate({
          tokensOut: tokensOutSell
        });

    } catch (error) {
      console.error('Error calculating trade estimate:', error);
      if (isBuy) {
        setBuyEstimate(null);
      } else {
        setSellEstimate(null);
      }
    }
  };

  // Update the tradeAmount change handler
  const handleTradeAmountChange = (e) => {
    const value = e.target.value;
    setTradeAmount(value);
    
    // Calculate estimates for both buy and sell
    if (value && parseFloat(value) > 0) {
      calculateTradeEstimate(value, true);  // Buy estimate
      calculateTradeEstimate(value, false); // Sell estimate
    } else {
      setBuyEstimate(null);
      setSellEstimate(null);
    }
  };
  
  // Render component
  return (
    <Container>
      <SectionTitle>Launch Your AI Token</SectionTitle>
      
      {!isConnected ? (
        <ConnectPrompt>Please connect your wallet to launch tokens</ConnectPrompt>
      ) : (
        <>
          <Grid>
            <Card>
              <CardTitle>Create New AI Token</CardTitle>
              <FormGrid>
                <FormGroup>
                  <Label>Token Name*</Label>
                  <Input
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="My AI Token"
                    disabled={loading}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Token Symbol*</Label>
                  <Input
                    type="text"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    placeholder="AIX"
                    disabled={loading}
                  />
                </FormGroup>
                
                <FormGroup $fullWidth>
                  <Label>Description*</Label>
                  <TextArea
                    value={tokenDescription}
                    onChange={(e) => setTokenDescription(e.target.value)}
                    placeholder="Describe your AI token"
                    disabled={loading}
                  />
                </FormGroup>
                
                <FormGroup $fullWidth>
                  <Label>Image URL*</Label>
                  <Input
                    type="text"
                    value={tokenImageUrl}
                    onChange={(e) => setTokenImageUrl(e.target.value)}
                    placeholder="https://example.com/image.png"
                    disabled={loading}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Website URL</Label>
                  <Input
                    type="text"
                    value={tokenWebsite}
                    onChange={(e) => setTokenWebsite(e.target.value)}
                    placeholder="https://example.com"
                    disabled={loading}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Twitter URL</Label>
                  <Input
                    type="text"
                    value={tokenTwitter}
                    onChange={(e) => setTokenTwitter(e.target.value)}
                    placeholder="https://twitter.com/myaitoken"
                    disabled={loading}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>GitHub URL</Label>
                  <Input
                    type="text"
                    value={tokenGithub}
                    onChange={(e) => setTokenGithub(e.target.value)}
                    placeholder="https://github.com/myaitoken"
                    disabled={loading}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Discord URL</Label>
                  <Input
                    type="text"
                    value={tokenDiscord}
                    onChange={(e) => setTokenDiscord(e.target.value)}
                    placeholder="https://discord.gg/myaitoken"
                    disabled={loading}
                  />
                </FormGroup>
                
                <FormGroup $fullWidth>
                  <Label>Purchase Amount* (Min: {parseFloat(tokenFee) + 0.0001})</Label>
                  <Input
                    type="number"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    placeholder={`Enter amount greater than ${tokenFee}`}
                    disabled={loading}
                    min={parseFloat(tokenFee) + 0.0001}
                    step="0.01"
                  />
                  <InfoText>Your asset token balance: {parseFloat(assetBalance).toFixed(4)}</InfoText>
                </FormGroup>
              </FormGrid>
              
              <ButtonContainer>
                {!assetApproved ? (
                  <ActionButton 
                    onClick={approveAssetToken} 
                    disabled={approving || loading}>
                    {approving ? 'Approving...' : 'Approve Asset Token'}
                  </ActionButton>
                ) : (
                  <ActionButton 
                    onClick={launchToken} 
                    disabled={loading}>
                    {loading ? 'Launching...' : 'Launch Token'}
                  </ActionButton>
                )}
                
                {/* <ActionButton
                  onClick={checkContractState}
                  disabled={loading}
                >
                  Debug Contracts
                </ActionButton> */}
              </ButtonContainer>
            </Card>
            
            <Card>
              <CardTitle>All Launched Tokens</CardTitle>
              
              {fetchingTokens ? (
                <LoadingContainer>
                  <LoadingSpinner />
                  <LoadingText>Loading all tokens...</LoadingText>
                </LoadingContainer>
              ) : deployedTokens.length === 0 ? (
                <EmptyState>
                  No tokens launched yet. Create your first AI token!
                </EmptyState>
              ) : (
                <TokenList>
                  {deployedTokens.map((token) => (
                    <TokenItem 
                      key={token.address} 
                      onClick={() => selectTokenForTrading(token.address)}
                      $selected={selectedToken?.address === token.address}
                    >
                      <TokenHeader>
                        <TokenName>{token.name}</TokenName>
                        <TokenSymbol>{token.symbol}</TokenSymbol>
                      </TokenHeader>
                      
                      <TokenDetails>
                        <TokenDetail>
                          <DetailLabel>Price per token</DetailLabel>
                          <DetailValue>{parseFloat(token.price).toFixed(8)}</DetailValue>
                        </TokenDetail>
                        
                        <TokenDetail>
                          <DetailLabel>Market Cap</DetailLabel>
                          <DetailValue>{formatNumber(parseFloat(token.marketCap).toFixed(2))+"$"}</DetailValue>
                        </TokenDetail>
                        
                        <TokenDetail>
                          <DetailLabel>24h Volume</DetailLabel>
                          <DetailValue>{formatNumber(parseFloat(token.volume24H).toFixed(2))+" MAI"}</DetailValue>
                        </TokenDetail>
                        
                        <TokenDetail>
                          <DetailLabel>Status</DetailLabel>
                          <TokenStatus $active={token.trading}>
                            {token.trading ? 'Trading' : 'Not Trading'}
                          </TokenStatus>
                        </TokenDetail>
                      </TokenDetails>
                    </TokenItem>
                  ))}
                </TokenList>
              )}
              
              {selectedToken && (
                <TradePanel>
                  <TradePanelTitle>Trade {selectedToken.symbol}</TradePanelTitle>
                  
                  <TokenBalance>
                    Your Balance: {parseFloat(tokenBalance).toFixed(4)} {selectedToken.symbol}
                  </TokenBalance>
                  
                  <InputWithInfo>
                    <Input
                      type="number"
                      value={tradeAmount}
                      onChange={handleTradeAmountChange}
                      placeholder="Enter amount"
                      disabled={loading}
                      min="0.0001"
                      step="0.01"
                    />
                    {selectedToken.symbol && (
                      <InfoBadge>{selectedToken.symbol}</InfoBadge>
                    )}
                  </InputWithInfo>
                  
                  {buyEstimate && (
                    <EstimatePanel>
                      <EstimateTitle>Buy Estimate</EstimateTitle>
                      <EstimateRow>
                        <EstimateLabel>You'll receive:</EstimateLabel>
                        <EstimateValue>{parseFloat(buyEstimate.tokensOut).toFixed(2)} {selectedToken.symbol}</EstimateValue>
                      </EstimateRow>
                    </EstimatePanel>
                  )}

                  {sellEstimate && (
                    <EstimatePanel>
                      <EstimateTitle>Sell Estimate</EstimateTitle>
                      <EstimateRow>
                        <EstimateLabel>You'll receive:</EstimateLabel>
                        <EstimateValue>{parseFloat(sellEstimate.tokensOut).toFixed(2)} MAI</EstimateValue>
                      </EstimateRow>
                    </EstimatePanel>
                  )}
                  
                  <TradeButtons>
                    <ActionButton 
                      $primary
                      onClick={buyTokens} 
                      disabled={loading || !tradeAmount || parseFloat(tradeAmount) <= 0}>
                      {loading ? 'Processing...' : 'Buy'}
                    </ActionButton>
                    
                    <ActionButton 
                      onClick={sellTokens} 
                      disabled={loading || !tradeAmount || parseFloat(tradeAmount) <= 0 || parseFloat(tradeAmount) > parseFloat(tokenBalance)}>
                      {loading ? 'Processing...' : 'Sell'}
                    </ActionButton>
                  </TradeButtons>
                </TradePanel>
              )}
            </Card>
          </Grid>
        </>
      )}
    </Container>
  );
};

// Styled components
const Container = styled.div`
  padding: 1rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #7e78f2 0%, #27b0e6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: rgba(35, 35, 70, 0.7);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.07);
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #f5f5f5;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.75rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  grid-column: ${props => props.$fullWidth ? '1 / span 2' : 'auto'};
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #b8b8d9;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: rgba(30, 30, 60, 0.5);
  border: 1px solid rgba(100, 100, 250, 0.3);
  border-radius: 8px;
  color: #f5f5f5;
  font-size: 0.95rem;
  
  &:focus {
    border-color: #7e78f2;
    outline: none;
  }
  
  &::placeholder {
    color: #8a8aa3;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: rgba(30, 30, 60, 0.5);
  border: 1px solid rgba(100, 100, 250, 0.3);
  border-radius: 8px;
  color: #f5f5f5;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: #7e78f2;
    outline: none;
  }
  
  &::placeholder {
    color: #8a8aa3;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const InfoText = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #8a8aa3;
`;

const ButtonContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$primary 
    ? 'linear-gradient(135deg, #7e78f2 0%, #27b0e6 100%)' 
    : 'linear-gradient(135deg, #464675 0%, #2d2d5b 100%)'};
  color: white;
  font-weight: 600;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: none;
  width: 100%;
  max-width: 300px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(126, 120, 242, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConnectPrompt = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: rgba(35, 35, 70, 0.5);
  border-radius: 12px;
  color: #b8b8d9;
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #8a8aa3;
`;

const TokenList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(100, 100, 250, 0.3);
    border-radius: 10px;
  }
`;

const TokenItem = styled.div`
  padding: 1rem;
  background-color: ${props => props.$selected ? 'rgba(126, 120, 242, 0.1)' : 'rgba(40, 40, 80, 0.5)'};
  border-radius: 10px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  border: 1px solid ${props => props.$selected ? 'rgba(126, 120, 242, 0.3)' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(126, 120, 242, 0.15);
  }
`;

const TokenHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const TokenName = styled.div`
  font-weight: 600;
  color: #f5f5f5;
`;

const TokenSymbol = styled.div`
  font-size: 0.9rem;
  color: #b8b8d9;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const TokenDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const TokenDetail = styled.div`
  flex: 1;
  min-width: 120px;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: #8a8aa3;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-size: 0.95rem;
  color: #f5f5f5;
  font-weight: 500;
`;

const TokenStatus = styled.div`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => props.$active ? 'rgba(59, 222, 128, 0.15)' : 'rgba(255, 94, 94, 0.15)'};
  color: ${props => props.$active ? '#3bde80' : '#ff5e5e'};
  border: 1px solid ${props => props.$active ? 'rgba(59, 222, 128, 0.3)' : 'rgba(255, 94, 94, 0.3)'};
`;

const TradePanel = styled.div`
  background-color: rgba(45, 45, 85, 0.7);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 1.5rem;
`;

const TradePanelTitle = styled.h3`
  font-size: 1.25rem;
  color: #f5f5f5;
  margin: 0 0 1rem 0;
  text-align: center;
`;

const TokenBalance = styled.div`
  text-align: center;
  font-size: 0.95rem;
  color: #b8b8d9;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 8px;
`;

const InputWithInfo = styled.div`
  position: relative;
`;

const InfoBadge = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #b8b8d9;
`;

const TradeButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
`;

const LoadingText = styled.div`
  margin-top: 1rem;
  color: #b8b8d9;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(126, 120, 242, 0.2);
  border-top: 3px solid #7e78f2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EstimatePanel = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(35, 35, 70, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(126, 120, 242, 0.2);
`;

const EstimateTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #b8b8d9;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const EstimateRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
`;

const EstimateLabel = styled.div`
  color: #8a8aa3;
`;

const EstimateValue = styled.div`
  color: #f5f5f5;
  font-weight: 500;
`;

export default TokenLaunch;