export interface NotePayload {
  email: string;
  note: string;
  mood: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
}
