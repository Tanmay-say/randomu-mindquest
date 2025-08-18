'use client';

import React, { useState } from 'react';
import { MindQuestContract, getSigner, switchToSepolia } from '@/lib/contract';
import { generatePersonalityStory, generatePersonalityType } from '@/lib/groq';
import Header from './Header';
import QuestionCard from './QuestionCard';
import PersonalityTraits from './PersonalityTraits';
import ResultsSummary from './ResultsSummary';

interface PersonalityTraits {
  bravery: number;
  logic: number;
  empathy: number;
  creativity: number;
  greed: number;
  wisdom: number;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  category: string;
}

type GamePhase = 'welcome' | 'playing' | 'completed' | 'minting' | 'minted' | 'error';

interface GameState {
  phase: GamePhase;
  currentQuestion: number;
  questions: Question[];
  responses: string[];
  traits: PersonalityTraits;
  aiStory: string;
  personalityType: string;
  mintedTokenId: number | null;
  error: string | null;
  walletConnected: boolean;
  userAddress: string | null;
}

const INITIAL_TRAITS: PersonalityTraits = {
  bravery: 50,
  logic: 50,
  empathy: 50,
  creativity: 50,
  greed: 50,
  wisdom: 50
};

const GAME_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "You discover a hidden treasure map. What do you do?",
    options: [
      "Follow it immediately, alone",
      "Research the map's authenticity first",
      "Share it with trusted friends",
      "Sell it to the highest bidder"
    ],
    category: "Adventure & Risk"
  },
  {
    id: 2,
    text: "A friend asks for help with a difficult problem. How do you respond?",
    options: [
      "Solve it for them quickly",
      "Guide them through the solution step by step",
      "Listen and offer emotional support",
      "Suggest they figure it out themselves"
    ],
    category: "Problem Solving"
  },
  {
    id: 3,
    text: "You're given creative freedom on a project. What's your approach?",
    options: [
      "Follow proven methods and best practices",
      "Experiment with new and unconventional ideas",
      "Collaborate with others to combine perspectives",
      "Focus on efficiency and practical results"
    ],
    category: "Creativity & Innovation"
  },
  {
    id: 4,
    text: "You witness someone being treated unfairly. What do you do?",
    options: [
      "Intervene immediately to stop it",
      "Document the incident and report it",
      "Offer support to the victim afterward",
      "Stay out of it to avoid conflict"
    ],
    category: "Justice & Empathy"
  },
  {
    id: 5,
    text: "You have limited time and resources. How do you prioritize?",
    options: [
      "Focus on what brings the most immediate results",
      "Plan for long-term sustainability",
      "Help others first, then yourself",
      "Analyze all options before deciding"
    ],
    category: "Resource Management"
  }
];

export default function MindQuestGame() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'welcome',
    currentQuestion: 0,
    questions: [],
    responses: [],
    traits: { ...INITIAL_TRAITS },
    aiStory: '',
    personalityType: '',
    mintedTokenId: null,
    error: null,
    walletConnected: false,
    userAddress: null
  });

  // Connect wallet and switch to Sepolia
  const connectWallet = async () => {
    try {
      const signer = await getSigner();
      if (!signer) {
        throw new Error('MetaMask not found');
      }

      await switchToSepolia();
      const address = await signer.getAddress();

      setGameState(prev => ({
        ...prev,
        walletConnected: true,
        userAddress: address
      }));
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to connect wallet';
      setGameState(prev => ({ ...prev, phase: 'error', error: message }));
    }
  };

  const startNewSession = () => {
    // Shuffle questions for variety
    const shuffledQuestions = [...GAME_QUESTIONS].sort(() => Math.random() - 0.5);
    
    setGameState(prev => ({
      ...prev,
      phase: 'playing',
      currentQuestion: 0,
      questions: shuffledQuestions,
      responses: [],
      traits: { ...INITIAL_TRAITS },
      aiStory: '',
      personalityType: '',
      mintedTokenId: null,
      error: null
    }));
  };

  const handleAnswer = async (answer: string) => {
    const { currentQuestion, questions, responses, traits } = gameState;
    
    // Update responses
    const newResponses = [...responses, answer];
    
    // Update traits based on answer (simplified logic)
    const newTraits = { ...traits };
    const question = questions[currentQuestion];
    
    if (question.category === 'Adventure & Risk') {
      if (answer.includes('immediately')) newTraits.bravery += 10;
      if (answer.includes('research')) newTraits.logic += 10;
      if (answer.includes('share')) newTraits.empathy += 10;
      if (answer.includes('sell')) newTraits.greed += 10;
    } else if (question.category === 'Problem Solving') {
      if (answer.includes('solve')) newTraits.logic += 10;
      if (answer.includes('guide')) newTraits.wisdom += 10;
      if (answer.includes('support')) newTraits.empathy += 10;
      if (answer.includes('figure')) newTraits.bravery += 10;
    } else if (question.category === 'Creativity & Innovation') {
      if (answer.includes('proven')) newTraits.logic += 10;
      if (answer.includes('experiment')) newTraits.creativity += 10;
      if (answer.includes('collaborate')) newTraits.empathy += 10;
      if (answer.includes('efficiency')) newTraits.wisdom += 10;
    } else if (question.category === 'Justice & Empathy') {
      if (answer.includes('intervene')) newTraits.bravery += 10;
      if (answer.includes('document')) newTraits.logic += 10;
      if (answer.includes('support')) newTraits.empathy += 10;
      if (answer.includes('avoid')) newTraits.wisdom += 10;
    } else if (question.category === 'Resource Management') {
      if (answer.includes('immediate')) newTraits.greed += 10;
      if (answer.includes('sustainability')) newTraits.wisdom += 10;
      if (answer.includes('help others')) newTraits.empathy += 10;
      if (answer.includes('analyze')) newTraits.logic += 10;
    }

    // Normalize traits to 0-100 range
    Object.keys(newTraits).forEach(key => {
      const traitKey = key as keyof PersonalityTraits;
      newTraits[traitKey] = Math.max(0, Math.min(100, newTraits[traitKey]));
    });

    if (currentQuestion + 1 < questions.length) {
      // Move to next question
      setGameState(prev => ({
        ...prev,
        currentQuestion: currentQuestion + 1,
        responses: newResponses,
        traits: newTraits
      }));
    } else {
      // Game completed - generate AI story and personality type
      try {
        const aiStory = await generatePersonalityStory(newTraits, newResponses);
        const personalityType = await generatePersonalityType(newTraits);
        
        setGameState(prev => ({
          ...prev,
          phase: 'completed',
          responses: newResponses,
          traits: newTraits,
          aiStory,
          personalityType
        }));
      } catch (error) {
        setGameState(prev => ({
          ...prev,
          phase: 'error',
          error: 'Failed to generate AI story. Please try again.'
        }));
      }
    }
  };

  const mintNFT = async () => {
    try {
      setGameState(prev => ({ ...prev, phase: 'minting' }));

      const signer = await getSigner();
      if (!signer) {
        throw new Error('Please connect your wallet first');
      }

      // Switch to Sepolia network
      await switchToSepolia();

      const contract = new MindQuestContract(signer);
      const tokenId = await contract.mintPersonalityNFT(
        gameState.traits,
        gameState.aiStory,
        gameState.personalityType
      );

      setGameState(prev => ({
        ...prev,
        phase: 'minted',
        mintedTokenId: tokenId
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mint NFT';
      setGameState(prev => ({
        ...prev,
        phase: 'error',
        error: errorMessage
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      phase: 'welcome',
      currentQuestion: 0,
      questions: [],
      responses: [],
      traits: { ...INITIAL_TRAITS },
      aiStory: '',
      personalityType: '',
      mintedTokenId: null,
      error: null
    });
  };

  const renderPhase = () => {
    switch (gameState.phase) {
      case 'welcome':
        return (
          <div className="text-center space-pro">
            <h1 className="font-hero text-4xl md:text-6xl text-gradient mb-6">
              Welcome to MindQuest
            </h1>
            <p className="font-subtitle text-xl md:text-2xl text-muted mb-8">
              Discover your AI-powered personality through blockchain technology
            </p>
            <div className="space-y-4">
              <div className="bg-surface border-2 border-black rounded-xl p-6">
                <h3 className="font-heading text-xl mb-4">🎯 How It Works</h3>
                <ul className="font-body text-left space-y-2">
                  <li>✅ Answer 5 personality questions (FREE)</li>
                  <li>✅ Get AI-generated personality story (FREE)</li>
                  <li>✅ Mint unique NFT on Sepolia (Gas fee only)</li>
                </ul>
              </div>
              <button
                onClick={startNewSession}
                className="btn-primary text-xl px-8 py-4"
              >
                Begin Your Quest
              </button>
            </div>
          </div>
        );

      case 'playing':
        return (
          <div className="space-pro">
            <QuestionCard
              question={gameState.questions[gameState.currentQuestion]}
              onAnswer={handleAnswer}
              currentQuestion={gameState.currentQuestion + 1}
              totalQuestions={gameState.questions.length}
            />
          </div>
        );

      case 'completed':
        return (
          <div className="space-pro">
            <ResultsSummary
              traits={gameState.traits}
              aiStory={gameState.aiStory}
              personalityType={gameState.personalityType}
              onMintNFT={mintNFT}
            />
            <div className="mt-8">
              <PersonalityTraits traits={gameState.traits} />
            </div>
          </div>
        );

      case 'minting':
        return (
          <div className="text-center space-pro">
            <div className="card max-w-2xl mx-auto">
              <div className="card-body">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <h2 className="font-heading text-2xl mb-4">Minting Your NFT...</h2>
                <p className="font-body text-muted">
                  Please confirm the transaction in your wallet. This may take a few minutes.
                </p>
              </div>
            </div>
          </div>
        );

      case 'minted':
        return (
          <div className="text-center space-pro">
            <div className="card max-w-4xl mx-auto">
              <div className="card-body">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="font-hero text-3xl md:text-4xl text-gradient mb-6">
                  NFT Minted Successfully!
                </h1>
                
                <div className="bg-surface border-2 border-black rounded-xl p-6 mb-6">
                  <h3 className="font-heading text-xl mb-4">Your Personality NFT</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="font-mono text-sm text-muted">Token ID</p>
                      <p className="font-body text-lg">#{gameState.mintedTokenId}</p>
                    </div>
                    <div>
                      <p className="font-mono text-sm text-muted">Personality Type</p>
                      <p className="font-body text-lg">{gameState.personalityType}</p>
                    </div>
                    <div>
                      <p className="font-mono text-sm text-muted">Total Score</p>
                      <p className="font-body text-lg">
                        {Object.values(gameState.traits).reduce((sum, trait) => sum + trait, 0)}/600
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-sm text-muted">Network</p>
                      <p className="font-body text-lg">Sepolia Testnet</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={resetGame}
                    className="btn-primary text-xl px-8 py-4"
                  >
                    Play Again
                  </button>
                  <p className="font-body text-sm text-muted">
                    Your NFT is now stored on the blockchain forever!
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-pro">
            <div className="card max-w-2xl mx-auto border-red-500">
              <div className="card-body">
                <div className="text-6xl mb-4">❌</div>
                <h2 className="font-heading text-2xl mb-4 text-red-600">Error Occurred</h2>
                <p className="font-body text-muted mb-6">{gameState.error}</p>
                <button
                  onClick={resetGame}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header 
        onConnectWallet={connectWallet}
        walletConnected={gameState.walletConnected}
        userAddress={gameState.userAddress || undefined}
      />
      <main className="container-pro py-8">
        {renderPhase()}
      </main>
    </div>
  );
}
