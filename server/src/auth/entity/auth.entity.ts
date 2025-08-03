export interface GoogleUser {
  email: string;
  name: string;
  avatar: string;
  provider: string; // "google"
  id: string; // Google ID
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
