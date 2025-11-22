export interface entryNote{
  id: string;
  email: string;
  line1: string;
  line2: string;
  line3: string;
  imageUrls: string[];
  mood: string;
  createdAt: Date;
  isDelete?: boolean;
  showMessage: boolean;
}

export interface updateEntryNote{
  id: string;
  email: string;
  line1: string;
  line2: string;
  line3: string;
  imageUrls: string[];
  mood: string;
  createdAt: Date;
  showMessage: boolean;
}
