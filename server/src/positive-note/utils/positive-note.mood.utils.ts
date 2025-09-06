// src/entries/mood.util.ts
import { Mood } from '@prisma/client';

export const moodToScore = (m: Mood): number => {
  switch (m) {
    case 'happy':
      return 2;
    case 'calm':
      return 1;
    case 'neutral':
      return 0;
    case 'tired':
      return -1;
    case 'sad':
      return -2;
  }
};
