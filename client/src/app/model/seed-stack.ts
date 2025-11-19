export interface stackRecord{
    id: string;
    userID: string;
    seedID: string;
    stack:  number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface seed{
    id: string;
    nameEng: string;
    nameTH: string;
    description: string;
    growthDays: number;
    icon: string;
    renderType: string;
    imageStage: string[];
    animationfile: string;
    animationKey: string;
    rarity: string;
    emotionTag: string;
}
export interface garden{
    id: string;
    userID: string;
    seedID: string;
    amount: number;
    icon: string;
}