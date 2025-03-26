export const MONAD_TESTNET = {
  chainId: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MONAD',
    decimals: 18
  },
  rpcUrls: ['https://rpc.testnet.monad.xyz/'],
  blockExplorerUrls: ['https://explorer.testnet.monad.xyz/']
};

export const SEPOLIA = {
  chainId: 11155111,
  name: 'Sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/s2AuCxmLRcsE8UBzkc33AyH57BG6CE4i'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/']
};


// Replace these with your actual deployed contract addresses
export const BONDING_CONTRACT_ADDRESS = '0x85D562eF9008a4Dc3Cb1A8e2b123192b060f2a59'; // Your deployed Bonding contract
export const ASSET_TOKEN_ADDRESS = '0x7234b758CCB19Ab07ad2E402C94Deb994Cf0C218';      // Usually a stablecoin or test token used for purchasing

// These ABIs match the contracts you've shared
export const BONDING_CONTRACT_ABI = [
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "factory_",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "router_",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "feeTo_",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "fee_",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "initialSupply_",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "assetRate_",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "maxTx_",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "gradThreshold_",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "account",
              "type": "address"
          }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "token",
              "type": "address"
          }
      ],
      "name": "SafeERC20FailedOperation",
      "type": "error"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "token",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount0",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount1",
              "type": "uint256"
          }
      ],
      "name": "Deployed",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "token",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "agentToken",
              "type": "address"
          }
      ],
      "name": "Graduated",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "token",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "pair",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "name": "Launched",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
          }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
  },
  {
      "inputs": [],
      "name": "K",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "assetRate",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountIn",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "tokenAddress",
              "type": "address"
          }
      ],
      "name": "buy",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "factory",
      "outputs": [
          {
              "internalType": "contract MFactory",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "fee",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "account",
              "type": "address"
          }
      ],
      "name": "getUserTokens",
      "outputs": [
          {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "gradThreshold",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "initialSupply",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "string",
              "name": "_name",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "_ticker",
              "type": "string"
          },
          {
              "internalType": "uint8[]",
              "name": "cores",
              "type": "uint8[]"
          },
          {
              "internalType": "string",
              "name": "desc",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "img",
              "type": "string"
          },
          {
              "internalType": "uint256",
              "name": "purchaseAmount",
              "type": "uint256"
          }
      ],
      "name": "launch",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "maxTx",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "owner",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "name": "profile",
      "outputs": [
          {
              "internalType": "address",
              "name": "user",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "name": "profiles",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "router",
      "outputs": [
          {
              "internalType": "contract MRouter",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "amountIn",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "tokenAddress",
              "type": "address"
          }
      ],
      "name": "sell",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "newRate",
              "type": "uint256"
          }
      ],
      "name": "setAssetRate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "components": [
                  {
                      "internalType": "bytes32",
                      "name": "tbaSalt",
                      "type": "bytes32"
                  },
                  {
                      "internalType": "address",
                      "name": "tbaImplementation",
                      "type": "address"
                  },
                  {
                      "internalType": "uint32",
                      "name": "daoVotingPeriod",
                      "type": "uint32"
                  },
                  {
                      "internalType": "uint256",
                      "name": "daoThreshold",
                      "type": "uint256"
                  }
              ],
              "internalType": "struct Bonding.DeployParams",
              "name": "params",
              "type": "tuple"
          }
      ],
      "name": "setDeployParams",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "newFee",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "newFeeTo",
              "type": "address"
          }
      ],
      "name": "setFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "newThreshold",
              "type": "uint256"
          }
      ],
      "name": "setGradThreshold",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "newSupply",
              "type": "uint256"
          }
      ],
      "name": "setInitialSupply",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "maxTx_",
              "type": "uint256"
          }
      ],
      "name": "setMaxTx",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "name": "tokenInfo",
      "outputs": [
          {
              "internalType": "address",
              "name": "creator",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "token",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "pair",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "agentToken",
              "type": "address"
          },
          {
              "components": [
                  {
                      "internalType": "address",
                      "name": "token",
                      "type": "address"
                  },
                  {
                      "internalType": "string",
                      "name": "name",
                      "type": "string"
                  },
                  {
                      "internalType": "string",
                      "name": "_name",
                      "type": "string"
                  },
                  {
                      "internalType": "string",
                      "name": "ticker",
                      "type": "string"
                  },
                  {
                      "internalType": "uint256",
                      "name": "supply",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "price",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "marketCap",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "liquidity",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "volume",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "volume24H",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "prevPrice",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "lastUpdated",
                      "type": "uint256"
                  }
              ],
              "internalType": "struct Bonding.Data",
              "name": "data",
              "type": "tuple"
          },
          {
              "internalType": "string",
              "name": "description",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "image",
              "type": "string"
          },
          {
              "internalType": "bool",
              "name": "trading",
              "type": "bool"
          },
          {
              "internalType": "bool",
              "name": "tradingOnUniswap",
              "type": "bool"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "name": "tokenInfos",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
          }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  }
];

export const ASSET_TOKEN_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

export const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];