'use client';

import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-pro relative">
        <div className="container-pro text-center">
          <div className="mb-16">
            <h1 className="font-hero text-7xl md:text-8xl text-black mb-8 text-gradient">
              MINDQUEST
            </h1>
            <p className="font-subtitle text-2xl text-gray-600 mb-6">
              AI PERSONALITY GAME
            </p>
            <div className="divider max-w-3xl mx-auto"></div>
          </div>
          
          <p className="font-body text-2xl text-gray-700 max-w-4xl mx-auto mb-16 leading-relaxed">
            Embark on a journey of self-discovery through AI-powered questions. 
            Your choices shape your destiny and mint a unique NFT reflection of your soul.
          </p>
          
          <button
            onClick={onGetStarted}
            className="btn-primary text-2xl px-16 py-6 transform hover:scale-110 transition-all duration-300 text-glow"
          >
            BEGIN YOUR QUEST
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-pro bg-surface">
        <div className="container-pro">
          <div className="text-center mb-20">
            <h2 className="font-heading text-5xl text-black mb-8 text-shadow">
              HOW IT WORKS
            </h2>
            <div className="divider max-w-2xl mx-auto"></div>
          </div>
          
          <div className="grid-pro md:grid-cols-3">
            <div className="card text-center hover-lift">
              <div className="card-body">
                <div className="w-24 h-24 bg-blue-100 border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <span className="font-display text-3xl text-blue-600">1</span>
                </div>
                <h3 className="font-heading text-2xl text-black mb-6">
                  CONNECT WALLET
                </h3>
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Connect your MetaMask wallet to the Ethereum Sepolia testnet to begin your journey
                </p>
              </div>
            </div>
            
            <div className="card text-center hover-lift">
              <div className="card-body">
                <div className="w-24 h-24 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <span className="font-display text-3xl text-green-600">2</span>
                </div>
                <h3 className="font-heading text-2xl text-black mb-6">
                  ANSWER QUESTIONS
                </h3>
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Answer 5 thought-provoking questions that reveal your true personality traits
                </p>
              </div>
            </div>
            
            <div className="card text-center hover-lift">
              <div className="card-body">
                <div className="w-24 h-24 bg-yellow-100 border-2 border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <span className="font-display text-3xl text-yellow-600">3</span>
                </div>
                <h3 className="font-heading text-2xl text-black mb-6">
                  MINT NFT
                </h3>
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  AI generates your unique story and mints your personality NFT on the blockchain
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="section-pro">
        <div className="container-pro">
          <div className="text-center mb-20">
            <h2 className="font-heading text-5xl text-black mb-8 text-shadow">
              POWERED BY
            </h2>
            <div className="divider max-w-2xl mx-auto"></div>
          </div>
          
          <div className="grid-pro md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center hover-lift">
              <div className="w-28 h-28 bg-surface border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-6 hover:border-blue-500 transition-colors duration-300">
                <span className="font-display text-3xl">⚡</span>
              </div>
              <h4 className="font-accent text-base text-gray-700 mb-3">ETHEREUM</h4>
              <p className="font-body text-sm text-gray-600">Sepolia Testnet</p>
            </div>
            
            <div className="text-center hover-lift">
              <div className="w-28 h-28 bg-surface border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-6 hover:border-green-500 transition-colors duration-300">
                <span className="font-display text-3xl">🤖</span>
              </div>
              <h4 className="font-accent text-base text-gray-700 mb-3">AI</h4>
              <p className="font-body text-sm text-gray-600">Groq QROQ</p>
            </div>
            
            <div className="text-center hover-lift">
              <div className="w-28 h-28 bg-surface border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-6 hover:border-purple-500 transition-colors duration-300">
                <span className="font-display text-3xl">🔗</span>
              </div>
              <h4 className="font-accent text-base text-gray-700 mb-3">SMART CONTRACTS</h4>
              <p className="font-body text-sm text-gray-600">Solidity</p>
            </div>
            
            <div className="text-center hover-lift">
              <div className="w-28 h-28 bg-surface border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-6 hover:border-pink-500 transition-colors duration-300">
                <span className="font-display text-3xl">🎨</span>
              </div>
              <h4 className="font-accent text-base text-gray-700 mb-3">NFTs</h4>
              <p className="font-body text-sm text-gray-600">ERC-721</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-pro bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-black to-purple-900 opacity-90"></div>
        <div className="container-pro text-center relative z-10">
          <h2 className="font-hero text-5xl text-white mb-8 text-shadow">
            READY TO DISCOVER YOUR TRUE SELF?
          </h2>
          <p className="font-body text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the revolution of AI-powered personality discovery and blockchain identity
          </p>
          <button
            onClick={onGetStarted}
            className="btn-secondary text-2xl px-16 py-6 transform hover:scale-110 transition-all duration-300 border-glow"
          >
            START YOUR JOURNEY
          </button>
        </div>
      </section>
    </div>
  );
}
