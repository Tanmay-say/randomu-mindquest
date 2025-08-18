import Groq from 'groq-sdk';

let groq: Groq | null = null;

function getGroqClient(): Groq | null {
  if (!process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY === 'demo-key') {
    return null;
  }
  
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
      dangerouslyAllowBrowser: true // Only for demo - use server-side in production
    });
  }
  
  return groq;
}

export interface PersonalityTraits {
  bravery: number;
  logic: number;
  empathy: number;
  creativity: number;
  greed: number;
  wisdom: number;
}

export interface Question {
  id: number;
  text: string;
  narrative: string;
  options: {
    text: string;
    traitChanges: [number, number, number, number, number, number]; // [bravery, logic, empathy, creativity, greed, wisdom]
  }[];
}

// Predefined questions for the game
export const GAME_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "You find a wallet on the ground with $500 cash inside.",
    narrative: "As you walk through the misty Forest of Choices, you stumble upon a leather wallet gleaming in the moonlight. Inside, crisp bills catch your eye...",
    options: [
      {
        text: "Take the money and leave the wallet",
        traitChanges: [110, 100, 80, 100, 130, 80] // +greed, -empathy, -wisdom
      },
      {
        text: "Take the wallet to the police station",
        traitChanges: [100, 110, 120, 100, 80, 115] // +logic, +empathy, -greed, +wisdom
      },
      {
        text: "Leave it where you found it",
        traitChanges: [90, 105, 105, 100, 85, 110] // -bravery, +logic, +empathy, -greed, +wisdom
      }
    ]
  },
  {
    id: 2,
    text: "You're offered a job that pays twice your current salary but requires you to move far from family.",
    narrative: "In the Chamber of Echoing Decisions, a mysterious voice presents you with an opportunity that could change everything...",
    options: [
      {
        text: "Take the job immediately",
        traitChanges: [120, 115, 85, 110, 115, 95] // +bravery, +logic, -empathy, +creativity, +greed
      },
      {
        text: "Decline to stay with family",
        traitChanges: [85, 100, 125, 100, 80, 110] // -bravery, +empathy, -greed, +wisdom
      },
      {
        text: "Negotiate for remote work",
        traitChanges: [105, 120, 110, 115, 105, 115] // +logic, +empathy, +creativity, +wisdom
      }
    ]
  },
  {
    id: 3,
    text: "You witness someone being bullied. What do you do?",
    narrative: "In the Arena of Moral Trials, you see a figure in distress as shadows loom over them menacingly...",
    options: [
      {
        text: "Immediately step in to help",
        traitChanges: [130, 100, 120, 100, 95, 110] // +bravery, +empathy, +wisdom
      },
      {
        text: "Call for help/authorities",
        traitChanges: [105, 115, 115, 100, 100, 115] // +logic, +empathy, +wisdom
      },
      {
        text: "Walk away to avoid trouble",
        traitChanges: [70, 95, 80, 100, 105, 90] // -bravery, -empathy, -wisdom
      }
    ]
  },
  {
    id: 4,
    text: "You're given a creative project with complete freedom but a tight deadline.",
    narrative: "The Tower of Infinite Possibilities opens before you, its walls pulsing with raw creative energy, but time slips away like sand...",
    options: [
      {
        text: "Create something completely original and risky",
        traitChanges: [115, 95, 100, 130, 100, 105] // +bravery, +creativity
      },
      {
        text: "Use a proven template and execute perfectly",
        traitChanges: [100, 120, 100, 90, 100, 110] // +logic, -creativity, +wisdom
      },
      {
        text: "Collaborate with others for fresh ideas",
        traitChanges: [100, 110, 115, 115, 95, 115] // +logic, +empathy, +creativity, +wisdom
      }
    ]
  },
  {
    id: 5,
    text: "You discover your company is doing something unethical but legal.",
    narrative: "In the Hall of Moral Mirrors, reflections of truth and consequence dance before your eyes, revealing uncomfortable realities...",
    options: [
      {
        text: "Blow the whistle publicly",
        traitChanges: [125, 105, 120, 100, 85, 120] // +bravery, +empathy, -greed, +wisdom
      },
      {
        text: "Keep quiet to protect your job",
        traitChanges: [80, 95, 85, 100, 115, 85] // -bravery, -empathy, +greed, -wisdom
      },
      {
        text: "Try to change things from within",
        traitChanges: [110, 115, 110, 110, 95, 115] // +bravery, +logic, +empathy, +creativity, +wisdom
      }
    ]
  }
];

export async function generatePersonalityStory(
  traits: PersonalityTraits,
  responses: string[]
): Promise<string> {
  const groqClient = getGroqClient();
  
  // If no API key, use fallback story generation
  if (!groqClient) {
    return generateFallbackStory(traits, responses);
  }

  try {
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI narrator for MindQuest, a personality-based RPG game. Generate a short, poetic story (2-3 sentences) about a player's personality journey based on their traits and choices. The story should be mystical and game-like, referring to them as a traveler in a fantasy realm.`
        },
        {
          role: "user",
          content: `Player traits: Bravery ${traits.bravery}, Logic ${traits.logic}, Empathy ${traits.empathy}, Creativity ${traits.creativity}, Greed ${traits.greed}, Wisdom ${traits.wisdom}. 

Choices made: ${responses.join(', ')}

Generate a short mystical story about their personality journey.`
        }
      ],
      model: "llama3-8b-8192",
      max_tokens: 150,
      temperature: 0.8
    });

    return completion.choices[0]?.message?.content || "The traveler's journey remains a mystery...";
  } catch (error) {
    console.error('Error generating story:', error);
    return generateFallbackStory(traits, responses);
  }
}

function generateFallbackStory(traits: PersonalityTraits, responses: string[]): string {
  const dominantTrait = Object.entries(traits).reduce((a, b) => 
    traits[a[0] as keyof PersonalityTraits] > traits[b[0] as keyof PersonalityTraits] ? a : b
  );

  const stories: Record<string, string> = {
    bravery: "Through the mists of the enchanted realm, a fearless warrior emerged, their courage shining like a beacon in the darkness. Every choice carved their legend deeper into the mystical tapestry of fate.",
    logic: "In the crystalline halls of wisdom, an analytical mind unraveled the mysteries of the realm with precision and clarity. Their methodical approach illuminated paths hidden from others.",
    empathy: "A compassionate soul wandered through the realm, their heart attuned to the whispers of all living things. Their kindness became a healing light that mended the fractured world around them.",
    creativity: "An innovative dreamer painted reality with strokes of pure imagination, transforming the mundane into the magical. Their creative spirit sparked new possibilities in every corner of the realm.",
    greed: "An ambitious seeker pursued the treasures of the realm with unwavering determination. Their desire for more became both their driving force and their greatest challenge.",
    wisdom: "A sage traveler walked the ancient paths, gathering knowledge like precious gems. Their understanding grew with each step, illuminating the deeper truths of the mystical realm."
  };

  return stories[dominantTrait[0]] || "The traveler's journey through the mystical realm revealed their unique essence, forever changing the fabric of their destiny.";
}

export async function generatePersonalityType(traits: PersonalityTraits): Promise<string> {
  const dominant = Object.entries(traits).reduce((a, b) => 
    traits[a[0] as keyof PersonalityTraits] > traits[b[0] as keyof PersonalityTraits] ? a : b
  );

  const typeMap: Record<string, string> = {
    bravery: "The Fearless Warrior",
    logic: "The Analytical Mind", 
    empathy: "The Compassionate Soul",
    creativity: "The Innovative Dreamer",
    greed: "The Ambitious Collector",
    wisdom: "The Enlightened Sage"
  };

  return typeMap[dominant[0]] || "The Balanced Seeker";
}

export function getRandomQuestion(excludeIds: number[] = []): Question {
  const availableQuestions = GAME_QUESTIONS.filter(q => !excludeIds.includes(q.id));
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  return availableQuestions[randomIndex];
}
