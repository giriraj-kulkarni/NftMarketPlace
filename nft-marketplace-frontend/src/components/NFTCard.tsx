'use client';

import React from 'react';
import Image from 'next/image';
import { NFT } from '@/types/nft';
import { Button } from '@/components/ui/Button';

interface NFTCardProps {
  nft: NFT;
  onBuy?: (nft: NFT) => void;
  showBuyButton?: boolean;
  isLoading?: boolean;
}

export function NFTCard({ nft, onBuy, showBuyButton = true, isLoading = false }: NFTCardProps) {
  const handleBuy = () => {
    if (onBuy) {
      onBuy(nft);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative w-full h-64 bg-gray-200">
        {nft.metadata?.image ? (
          <Image
            src={nft.metadata.image}
            alt={nft.metadata?.name || 'NFT'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {nft.metadata?.name || `NFT #${nft.tokenId}`}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {nft.metadata?.description || 'No description available'}
        </p>

        {/* Price and Token Info */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-lg font-bold text-gray-900">{nft.price} ETH</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Token ID</p>
            <p className="text-sm font-medium text-gray-900">#{nft.tokenId}</p>
          </div>
        </div>

        {/* Seller Info */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">Seller</p>
          <p className="text-sm font-mono text-gray-700 truncate">
            {nft.seller}
          </p>
        </div>

        {/* Buy Button */}
        {showBuyButton && !nft.sold && (
          <Button
            onClick={handleBuy}
            loading={isLoading}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : `Buy for ${nft.price} ETH`}
          </Button>
        )}

        {nft.sold && (
          <div className="w-full text-center py-2 bg-gray-100 rounded-lg">
            <span className="text-gray-600 font-medium">Sold</span>
          </div>
        )}
      </div>
    </div>
  );
}
