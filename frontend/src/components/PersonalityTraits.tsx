'use client';

import React from 'react';
import { PersonalityTraits as Traits } from '@/lib/groq';

interface PersonalityTraitsProps {
  traits: Traits;
  className?: string;
}

export default function PersonalityTraits({ traits, className = '' }: PersonalityTraitsProps) {
  const traitLabels = {
    bravery: 'BRAVERY',
    logic: 'LOGIC',
    empathy: 'EMPATHY',
    creativity: 'CREATIVITY',
    greed: 'GREED',
    wisdom: 'WISDOM'
  };

  const getTraitColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTraitWidth = (value: number) => {
    return `${value}%`;
  };

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <h3 className="font-heading text-2xl text-black text-shadow">
          PERSONALITY TRAITS
        </h3>
        <p className="font-body text-lg text-gray-600 mt-3 leading-relaxed">
          Your current personality profile based on your choices
        </p>
      </div>

      <div className="card-body">
        <div className="space-pro">
          {Object.entries(traits).map(([key, value]) => (
            <div key={key} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-accent text-base text-gray-700">
                  {traitLabels[key as keyof typeof traitLabels]}
                </span>
                <div className="bg-surface border border-gray-300 rounded-lg px-3 py-1">
                  <span className="font-mono text-sm font-semibold text-black">
                    {value}/100
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 border-2 border-black rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ease-out rounded-full ${getTraitColor(value)}`}
                  style={{ width: getTraitWidth(value) }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>
          ))}
        </div>

        <div className="divider"></div>
        
        <div className="text-center">
          <div className="inline-block bg-blue-100 border-2 border-blue-500 rounded-xl px-6 py-4">
            <span className="font-accent text-base text-blue-800">
              TOTAL SCORE: {Object.values(traits).reduce((sum, val) => sum + val, 0)}/600
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
