export interface QuickNote {
  id: string;
  thankMessage: string;
  isDelete: boolean;
  createdAt: string;
  userId: string | null;
}

export interface QuickNoteDto {
  thankMessage: string;
}
