import { Mood } from '@prisma/client';

export interface getAllNoteSendById {
  id: string;
  email: string;
  line1: string;
  imageUrls: string[];
  mood: Mood;
  createdAt: Date;
}
