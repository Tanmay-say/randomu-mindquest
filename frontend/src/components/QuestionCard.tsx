'use client';

import React from 'react';

interface QuestionCardProps {
  question: {
    id: number;
    text: string;
    options: string[];
    category: string;
  };
  onAnswer: (answer: string) => void;
  currentQuestion: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  currentQuestion,
  totalQuestions
}) => {
  return (
    <div className="card max-w-4xl mx-auto">
      <div className="card-header text-center">
        <div className="font-mono text-sm text-muted mb-2">
          Question {currentQuestion} of {totalQuestions}
        </div>
        <h2 className="font-heading text-2xl md:text-3xl text-gradient">
          {question.category}
        </h2>
      </div>
      
      <div className="card-body space-pro">
        <div className="text-center mb-8">
          <p className="font-body text-lg md:text-xl leading-relaxed">
            &ldquo;{question.text}&rdquo;
          </p>
        </div>
        
        <div className="grid gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              className="btn-outline text-left p-4 hover-lift transition-all duration-300"
            >
              <span className="font-mono text-sm text-muted mr-3">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="font-body">{option}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
