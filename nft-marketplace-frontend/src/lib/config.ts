// Network Configuration
export const NETWORKS = {
  localhost: {
    name: 'Hardhat Local',
    chainId: 31337,
    rpcUrl: 'http://127.0.0.1:8545',
    explorerUrl: '',
    currency: 'ETH',
    testnet: true
  },
  hardhat: {
    name: 'Hardhat Local',
    chainId: 31337,
    rpcUrl: 'http://127.0.0.1:8545',
    explorerUrl: '',
    currency: 'ETH',
    testnet: true
  },
  sepolia: {
    name: 'Sepolia',
    chainId: 11155111,
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/your-project-id',
    explorerUrl: 'https://sepolia.etherscan.io',
    currency: 'ETH',
    testnet: true
  },
  mumbai: {
    name: 'Polygon Mumbai',
    chainId: 80001,
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorerUrl: 'https://mumbai.polygonscan.com',
    currency: 'MATIC',
    testnet: true
  },
  polygon: {
    name: 'Polygon',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    currency: 'MATIC',
    testnet: false
  }
} as const;

// Contract Configuration
export const CONTRACT_CONFIG = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Fallback to known address
  networkId: process.env.NEXT_PUBLIC_NETWORK_ID ? parseInt(process.env.NEXT_PUBLIC_NETWORK_ID) : 31337,
  networkName: process.env.NEXT_PUBLIC_NETWORK_NAME || 'localhost'
} as const;

// IPFS Configuration
export const IPFS_CONFIG = {
  pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY || '',
  pinataSecretKey: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || '',
  gateway: 'https://gateway.pinata.cloud/ipfs/'
} as const;

// Get current network configuration
export const getCurrentNetwork = () => {
  const networkId = CONTRACT_CONFIG.networkId;
  return Object.values(NETWORKS).find(network => network.chainId === networkId) || NETWORKS.localhost;
};

// Validate network connection
export const validateNetwork = (chainId: number) => {
  return chainId === CONTRACT_CONFIG.networkId;
};

// Get network switching parameters
export const getNetworkSwitchParams = () => {
  const network = getCurrentNetwork();
  return {
    chainId: `0x${network.chainId.toString(16)}`,
    chainName: network.name,
    nativeCurrency: {
      name: network.currency,
      symbol: network.currency,
      decimals: 18
    },
    rpcUrls: [network.rpcUrl],
    blockExplorerUrls: network.explorerUrl ? [network.explorerUrl] : []
  };
};

