export interface GoogleUser {
  email: string;
  name: string;
  avatarUrl: string;
  provider: string; // "google"
  id: string; // Google ID
  accessToken?: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: string | null;
  googleId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
