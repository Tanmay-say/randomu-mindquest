'use client';

import React, { useState } from 'react';
import MindQuestGame from '@/components/MindQuestGame';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  const [showGame, setShowGame] = useState(false);

  const handleGetStarted = () => {
    setShowGame(true);
  };

  if (showGame) {
    return <MindQuestGame />;
  }

  return <LandingPage onGetStarted={handleGetStarted} />;
}