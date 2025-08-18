'use client';

import React from 'react';
import { PersonalityTraits } from '@/lib/groq';

interface ResultsSummaryProps {
  traits: PersonalityTraits;
  aiStory: string;
  personalityType: string;
  onMintNFT: () => void;
  isLoading?: boolean;
}

export default function ResultsSummary({ 
  traits, 
  aiStory, 
  personalityType, 
  onMintNFT, 
  isLoading = false 
}: ResultsSummaryProps) {
  return (
    <div className="card fade-in max-w-5xl mx-auto">
      <div className="card-header">
        <h2 className="font-hero text-4xl text-black text-center mb-6 text-gradient">
          YOUR JOURNEY COMPLETE
        </h2>
        <div className="divider"></div>
        
        <div className="text-center mb-8">
          <div className="inline-block bg-yellow-100 border-2 border-yellow-500 rounded-xl px-8 py-4">
            <h3 className="font-heading text-2xl text-yellow-800 text-shadow">
              {personalityType}
            </h3>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* AI Story */}
          <div className="space-y-6">
            <h4 className="font-heading text-xl text-black text-shadow">
              YOUR STORY
            </h4>
            <div className="bg-surface border-2 border-black rounded-xl p-6 min-h-[250px]">
              <p className="font-subtitle text-lg text-gray-700 leading-relaxed">
                {aiStory || "Your AI-generated story will appear here..."}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <h4 className="font-heading text-xl text-black text-shadow">
              QUICK STATS
            </h4>
            <div className="space-y-4">
              {Object.entries(traits).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="font-accent text-base text-gray-700">
                    {key.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 border border-black rounded-full h-3">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          value >= 80 ? 'bg-green-500' : 
                          value >= 60 ? 'bg-blue-500' : 
                          value >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <div className="bg-surface border border-gray-300 rounded-lg px-3 py-1 min-w-[3rem] text-center">
                      <span className="font-mono text-sm font-semibold text-black">
                        {value}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* Mint NFT Section */}
        <div className="text-center">
          <h4 className="font-heading text-2xl text-black mb-6 text-shadow">
            READY TO MINT YOUR NFT?
          </h4>
          <p className="font-body text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your unique personality NFT will be minted on the Ethereum blockchain
          </p>
          
          <button
            onClick={onMintNFT}
            disabled={isLoading}
            className={`font-accent px-12 py-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? 'MINTING...' : 'MINT PERSONALITY NFT'}
          </button>
          
          {isLoading && (
            <div className="mt-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="font-body text-base text-gray-600 mt-4">
                Processing blockchain transaction...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
