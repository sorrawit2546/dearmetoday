export interface CommunityPost {
  id: string;
  email: string;
  line1: string;
  line2: string | null;
  line3: string | null;
  imageUrls: string[];
  mood: 'happy' | 'neutral' | 'sad' | string; // ใส่ union type ที่แน่ ๆ ไปก่อน
  showMessage: boolean;
  isDelete: boolean;
  createdAt: string;   // ถ้าอยากใช้ Date จริง ๆ แนะนำให้แปลงใน service
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
}
