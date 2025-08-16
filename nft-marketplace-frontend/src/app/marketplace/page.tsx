'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useNFTContract } from '@/hooks/useNFTContract';
import { NFTCard } from '@/components/NFTCard';
import { Button } from '@/components/ui/Button';
import { NFT } from '@/types/nft';

export default function Marketplace() {
  const { provider, isConnected } = useWeb3();
  const { fetchMarketNFTs, buyNFT, isLoading, error } = useNFTContract(provider);
  
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);
  const [buyingTokenId, setBuyingTokenId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNFTs, setFilteredNFTs] = useState<NFT[]>([]);

  // Fetch NFTs on component mount
  useEffect(() => {
    loadMarketplaceNFTs();
  }, [provider]);

  // Filter NFTs based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = nfts.filter(nft => 
        nft.metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.metadata?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNFTs(filtered);
    } else {
      setFilteredNFTs(nfts);
    }
  }, [searchTerm, nfts]);

  const loadMarketplaceNFTs = async () => {
    setLoadingNFTs(true);
    try {
      const marketNFTs = await fetchMarketNFTs();
      setNfts(marketNFTs);
    } catch (err) {
      console.error('Error loading marketplace NFTs:', err);
    } finally {
      setLoadingNFTs(false);
    }
  };

  const handleBuyNFT = async (nft: NFT) => {
    if (!isConnected) {
      alert('Please connect your wallet to buy NFTs');
      return;
    }

    setBuyingTokenId(nft.tokenId);
    try {
      await buyNFT(nft.tokenId, nft.price);
      alert('NFT purchased successfully!');
      
      // Refresh the marketplace
      await loadMarketplaceNFTs();
    } catch (err: any) {
      console.error('Error buying NFT:', err);
      alert(`Failed to buy NFT: ${err.message || 'Unknown error'}`);
    } finally {
      setBuyingTokenId(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          NFT Marketplace
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Discover, collect, and sell extraordinary NFTs
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search NFTs..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center mb-8">
        <Button onClick={loadMarketplaceNFTs} loading={loadingNFTs} disabled={loadingNFTs}>
          {loadingNFTs ? 'Loading...' : 'Refresh Marketplace'}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loadingNFTs && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg text-gray-600">Loading NFTs...</span>
        </div>
      )}

      {/* NFTs Grid */}
      {!loadingNFTs && (
        <>
          {filteredNFTs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchTerm ? 'No NFTs match your search' : 'No NFTs available'}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search terms.' 
                  : 'Be the first to create an NFT for this marketplace!'
                }
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button onClick={() => window.location.href = '/create'}>
                    Create your first NFT
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 text-center">
                <p className="text-gray-600">
                  {filteredNFTs.length} NFT{filteredNFTs.length !== 1 ? 's' : ''} available
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNFTs.map((nft) => (
                  <NFTCard
                    key={nft.tokenId}
                    nft={nft}
                    onBuy={handleBuyNFT}
                    isLoading={buyingTokenId === nft.tokenId}
                    showBuyButton={isConnected}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Connect Wallet Message */}
      {!isConnected && !loadingNFTs && (
        <div className="text-center mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-blue-700 mb-4">
            Connect your wallet to buy NFTs and interact with the marketplace.
          </p>
        </div>
      )}
    </div>
  );
}
