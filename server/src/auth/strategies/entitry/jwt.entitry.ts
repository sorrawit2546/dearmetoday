export interface IJwtPayload {
  sub: string;
  name: string;
  email: string;
  avatarUrl?: string; // optional
}
