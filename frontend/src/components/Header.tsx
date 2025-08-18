'use client';

import React from 'react';

interface HeaderProps {
  onConnectWallet?: () => void;
  walletConnected?: boolean;
  userAddress?: string;
}

export default function Header({ onConnectWallet, walletConnected, userAddress }: HeaderProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="w-full bg-white border-b-2 border-black sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container-pro">
        <div className="flex items-center justify-between py-6">
          {/* Logo and Brand */}
          <div className="flex flex-col">
            <h1 className="font-hero text-4xl text-black text-gradient">
              MINDQUEST
            </h1>
            <p className="font-subtitle text-sm text-gray-600 mt-1">
              AI PERSONALITY GAME
            </p>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            <a href="#game" className="font-accent text-black hover:text-blue-600 transition-all duration-300 relative group">
              GAME
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#nfts" className="font-accent text-black hover:text-blue-600 transition-all duration-300 relative group">
              NFTS
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#about" className="font-accent text-black hover:text-blue-600 transition-all duration-300 relative group">
              ABOUT
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-6">
            {walletConnected && userAddress && (
              <div className="hidden md:block">
                <div className="bg-surface border border-gray-300 rounded-xl px-4 py-2">
                  <span className="font-mono text-sm text-gray-700">
                    {formatAddress(userAddress)}
                  </span>
                </div>
              </div>
            )}
            
            <button
              onClick={onConnectWallet}
              className={`font-accent px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                walletConnected
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
