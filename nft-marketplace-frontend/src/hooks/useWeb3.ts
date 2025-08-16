'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Web3State } from '@/types/nft';
import { validateNetwork, getNetworkSwitchParams, getCurrentNetwork } from '@/lib/config';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask: boolean;
      request: (args: { method: string }) => Promise<string[]>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export function useWeb3() {
  const [state, setState] = useState<Web3State>({
    account: null,
    isConnected: false,
    isLoading: false,
    error: null,
  });

  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum?.isMetaMask;
  };

  // Connect to wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setState(prev => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask to continue.',
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        // Check and switch network if needed
        await validateAndSwitchNetwork();

        setState({
          account: accounts[0],
          isConnected: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  // Validate and switch network
  const validateAndSwitchNetwork = async () => {
    if (!window.ethereum) return;

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainId, 16);
      const targetChainId = getCurrentNetwork().chainId;

      if (!validateNetwork(currentChainId)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${targetChainId.toString(16)}` }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [getNetworkSwitchParams()],
              });
            } catch (addError) {
              throw new Error('Failed to add network to MetaMask');
            }
          } else {
            throw switchError;
          }
        }
      }
    } catch (error) {
      console.error('Network validation error:', error);
      throw error;
    }
  };

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setState({
      account: null,
      isConnected: false,
      isLoading: false,
      error: null,
    });
    setProvider(null);
  }, []);

  // Check if wallet is already connected
  const checkConnection = useCallback(async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length > 0) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        setState({
          account: accounts[0],
          isConnected: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setState(prev => ({
          ...prev,
          account: accounts[0],
          isConnected: true,
        }));
      }
    };

    const handleChainChanged = () => {
      // Reload the page when chain changes
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Check if already connected on mount
    checkConnection();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [checkConnection, disconnectWallet]);

  return {
    ...state,
    provider,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
}
