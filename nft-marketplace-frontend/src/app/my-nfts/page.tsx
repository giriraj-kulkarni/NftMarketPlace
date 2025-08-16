'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useNFTContract } from '@/hooks/useNFTContract';
import { NFTCard } from '@/components/NFTCard';
import { Button } from '@/components/ui/Button';
import { NFT } from '@/types/nft';

export default function MyNFTs() {
  const { provider, isConnected, connectWallet } = useWeb3();
  const { fetchMyNFTs, isLoading } = useNFTContract(provider);
  
  const [myNFTs, setMyNFTs] = useState<NFT[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);

  // Fetch user's NFTs on component mount and when provider changes
  useEffect(() => {
    if (isConnected && provider) {
      loadMyNFTs();
    }
  }, [isConnected, provider]);

  const loadMyNFTs = async () => {
    setLoadingNFTs(true);
    try {
      const userNFTs = await fetchMyNFTs();
      setMyNFTs(userNFTs);
    } catch (error) {
      console.error('Error loading user NFTs:', error);
    } finally {
      setLoadingNFTs(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Connect Your Wallet</h2>
          <p className="mt-2 text-lg text-gray-600">
            You need to connect your wallet to view your NFTs
          </p>
          <div className="mt-6">
            <Button onClick={connectWallet} size="lg">
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          My NFTs
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Your digital collectibles and creations
        </p>
      </div>

      {/* Refresh Button */}
      <div className="text-center mb-8">
        <Button onClick={loadMyNFTs} loading={loadingNFTs} disabled={loadingNFTs}>
          {loadingNFTs ? 'Loading...' : 'Refresh My NFTs'}
        </Button>
      </div>

      {/* Loading State */}
      {loadingNFTs && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg text-gray-600">Loading your NFTs...</span>
        </div>
      )}

      {/* NFTs Display */}
      {!loadingNFTs && (
        <>
          {myNFTs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No NFTs found</h3>
              <p className="mt-2 text-sm text-gray-500">
                You don't own any NFTs yet. Start by creating or buying your first NFT!
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <Button onClick={() => window.location.href = '/create'}>
                  Create NFT
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/marketplace'}
                >
                  Browse Marketplace
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  You own {myNFTs.length} NFT{myNFTs.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myNFTs.map((nft) => (
                  <div key={nft.tokenId} className="relative">
                    <NFTCard
                      nft={nft}
                      showBuyButton={false} // Don't show buy button for owned NFTs
                    />
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      OWNED
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Actions */}
              <div className="text-center mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Want to expand your collection?
                </h3>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => window.location.href = '/create'}>
                    Create New NFT
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/marketplace'}
                  >
                    Browse Marketplace
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
