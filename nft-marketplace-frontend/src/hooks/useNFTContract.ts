'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { NFT_MARKETPLACE_ABI } from '@/lib/contracts';
import { NFT, NFTMetadata, CreateNFTData } from '@/types/nft';
import { CONTRACT_CONFIG } from '@/lib/config';

export function useNFTContract(provider: ethers.providers.Web3Provider | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get contract instance
  const getContract = () => {
    if (!provider || !CONTRACT_CONFIG.address) {
      throw new Error('Provider or contract address not available');
    }
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_CONFIG.address, NFT_MARKETPLACE_ABI, signer);
  };

  // Upload to IPFS (Pinata) - Simplified for local testing
  const uploadToIPFS = async (file: File): Promise<string> => {
    // For local testing, convert image to data URL instead of uploading to IPFS
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload metadata to IPFS - Simplified for local testing
  const uploadMetadataToIPFS = async (metadata: NFTMetadata): Promise<string> => {
    // For local testing, return a simple data URL for metadata
    const metadataString = JSON.stringify(metadata);
    const blob = new Blob([metadataString], { type: 'application/json' });
    return URL.createObjectURL(blob);
  };

  // Create NFT
  const createNFT = async (nftData: CreateNFTData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!provider) {
        throw new Error('Wallet not connected');
      }

      // Upload image to IPFS
      const imageUrl = await uploadToIPFS(nftData.image);

      // Create metadata
      const metadata: NFTMetadata = {
        name: nftData.name,
        description: nftData.description,
        image: imageUrl,
      };

      // Upload metadata to IPFS
      const metadataUrl = await uploadMetadataToIPFS(metadata);

      // Get contract
      const contract = getContract();

      // Get listing price
      const listingPrice = await contract.getListingPrice();

      // Convert price to wei
      const priceInWei = ethers.utils.parseEther(nftData.price);

      // Create token
      const transaction = await contract.createToken(metadataUrl, priceInWei, {
        value: listingPrice,
      });

      await transaction.wait();
      
      setIsLoading(false);
      return transaction;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create NFT';
      setIsLoading(false);
      setError(errorMessage);
      throw error;
    }
  };

  // Fetch marketplace NFTs
  const fetchMarketNFTs = async (): Promise<NFT[]> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!provider) {
        throw new Error('Provider not available');
      }

      const contract = new ethers.Contract(CONTRACT_CONFIG.address, NFT_MARKETPLACE_ABI, provider);
      const data = await contract.fetchMarketItem();

      const nfts = await Promise.all(
        data.map(async (item: { tokenId: ethers.BigNumber; seller: string; owner: string; price: ethers.BigNumber; sold: boolean }) => {
          try {
            const tokenURI = await contract.tokenURI(item.tokenId);
            const meta = await axios.get(tokenURI);
            
            return {
              tokenId: item.tokenId.toNumber(),
              seller: item.seller,
              owner: item.owner,
              price: ethers.utils.formatEther(item.price),
              sold: item.sold,
              metadata: meta.data,
              tokenURI,
            } as NFT;
          } catch (error) {
            console.error(`Error fetching NFT ${item.tokenId}:`, error);
            return null;
          }
        })
      );

      const validNFTs = nfts.filter(nft => nft !== null) as NFT[];
      setIsLoading(false);
      return validNFTs;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch NFTs';
      setIsLoading(false);
      setError(errorMessage);
      return [];
    }
  };

  // Buy NFT
  const buyNFT = async (tokenId: number, price: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!provider) {
        throw new Error('Wallet not connected');
      }

      const contract = getContract();
      const priceInWei = ethers.utils.parseEther(price);

      const transaction = await contract.createMarketSale(tokenId, {
        value: priceInWei,
      });

      await transaction.wait();
      setIsLoading(false);
      return transaction;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to buy NFT';
      setIsLoading(false);
      setError(errorMessage);
      throw error;
    }
  };

  // Fetch user's NFTs
  const fetchMyNFTs = async (): Promise<NFT[]> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!provider) {
        throw new Error('Provider not available');
      }

      const contract = getContract();
      const data = await contract.fetchMyNFT();

      const nfts = await Promise.all(
        data.map(async (item: { tokenId: ethers.BigNumber; seller: string; owner: string; price: ethers.BigNumber; sold: boolean }) => {
          try {
            const tokenURI = await contract.tokenURI(item.tokenId);
            const meta = await axios.get(tokenURI);
            
            return {
              tokenId: item.tokenId.toNumber(),
              seller: item.seller,
              owner: item.owner,
              price: ethers.utils.formatEther(item.price),
              sold: item.sold,
              metadata: meta.data,
              tokenURI,
            } as NFT;
          } catch (error) {
            console.error(`Error fetching user NFT ${item.tokenId}:`, error);
            return null;
          }
        })
      );

      const validNFTs = nfts.filter(nft => nft !== null) as NFT[];
      setIsLoading(false);
      return validNFTs;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch your NFTs';
      setIsLoading(false);
      setError(errorMessage);
      return [];
    }
  };

  // Get listing price
  const getListingPrice = async (): Promise<string> => {
    try {
      if (!provider) {
        throw new Error('Provider not available');
      }

      const contract = new ethers.Contract(CONTRACT_CONFIG.address, NFT_MARKETPLACE_ABI, provider);
      const listingPrice = await contract.getListingPrice();
      return ethers.utils.formatEther(listingPrice);
    } catch (error) {
      console.error('Error getting listing price:', error);
      return '0.0025'; // Default listing price
    }
  };

  return {
    createNFT,
    fetchMarketNFTs,
    buyNFT,
    fetchMyNFTs,
    getListingPrice,
    isLoading,
    error,
  };
}
