import { Mood } from '@prisma/client';

export interface IpositiveNoteByNoteId {
  id: string;
  email: string;
  line1: string;
  line2?: string;
  line3?: string;
  imageUrls: string[];
  mood: Mood;
  showMessage: boolean;
  isDelete: boolean;
  userId: string;
  moodScore: number;
  createdAt: Date;
  updatedAt?: Date;
}
export interface getAllNoteSendById {
  id: string;
  email: string;
  line1: string;
  imageUrls: string[];
  mood: Mood;
  createdAt: Date;
}

export interface getAllNoteSendByIdResponse {
  data: {
    mapResult: getAllNoteSendById[];
    countNote: number;
  };
}

export interface user {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
}

export interface getAllNotesCommunity {
  id: string;
  email: string;
  line1: string;
  imageUrls: string[];
  mood: Mood;
  showMessage: boolean;
  isDelete: boolean;
  createdAt: Date;
  userId: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
}
