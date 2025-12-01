import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Rarity, RenderType, Mood } from "@prisma/client";
import { Type } from "class-transformer";

export class createSeedDTO {
    @IsString()
    nameEng: string;

    @IsString()
    nameTH: string;

    @IsString()
    description: string;

    @IsNumber()
    @Type(() => Number)
    growthDays: number;

    // @IsString()
    // icon: string; // Icon image url

    @IsEnum(RenderType)
    renderType: RenderType;

    // @IsArray()
    // imageStages: string[];

    @IsString()
    @IsOptional()
    animationFile: string;

    @IsString()
    @IsOptional()
    animationKey: string;

    @IsEnum(Rarity)
    rarity: Rarity;

    @IsEnum(Mood)
    emotionTag: Mood;

    @IsString()
    unlockCondition: string
}