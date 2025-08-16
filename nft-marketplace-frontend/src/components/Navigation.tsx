'use client';

import React from 'react';
import Link from 'next/link';
import { useWeb3 } from '@/hooks/useWeb3';
import { Button } from '@/components/ui/Button';

export function Navigation() {
  const { account, isConnected, connectWallet, disconnectWallet, isLoading } = useWeb3();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">NFT Marketplace</h1>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/marketplace"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Marketplace
              </Link>
              <Link
                href="/create"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Create NFT
              </Link>
              {isConnected && (
                <Link
                  href="/my-nfts"
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  My NFTs
                </Link>
              )}
            </div>
          </div>

          {/* Wallet connection */}
          <div className="flex items-center">
            {isConnected && account ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <span className="text-sm text-gray-700">
                    Connected: {truncateAddress(account)}
                  </span>
                </div>
                <Button
                  onClick={disconnectWallet}
                  variant="outline"
                  size="sm"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
          <Link
            href="/marketplace"
            className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Marketplace
          </Link>
          <Link
            href="/create"
            className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Create NFT
          </Link>
          {isConnected && (
            <Link
              href="/my-nfts"
              className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              My NFTs
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
