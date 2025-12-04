import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { createSeedDTO } from "./dto/seed/createSeed.dto";
import { createUserHasSeedDTO } from "./dto/userHasSeed/createUserHasSeed.dto";
import { UUID } from "crypto";

@Injectable()
export class SeedStackRepository{
    constructor(
        private prisma: PrismaService
    ){}

    // ************************************* Stack Record *****************************************************************
    // createStackRecord()
    // 
    async createStackRecord(userID: string, seedID: string){
        //    const data = await this.prisma.stackRecord.create({
        //         // data: {
        //         //     stack: 1,
        //         //     // status: ,
        //         //     userId: userID,
        //         //     seedId: seedID,
        //         // }
        //    })
        //    return data;
    }
    // getStackRecordByID() 
    // 
    async getStackRecordByID(userID: string){
        const data = await this.prisma.stackRecord.findFirst({
            where: {
                userId: userID,
        }
        })
        return data;
    }
    // setStackRecordByID()
    //
    async setStackRecordByID(userID: string){
        const data = await this.prisma.stackRecord.update({
            where: {
                userId: userID
            },
            data: {
                // stack: stack++,
                updatedAt: new Date()
            }
        })
        return data;
    }
    // deleteStackRecordByID()
    //
    async deleteStackRecordByID(ID: string, userID: string, seedID: string){
        const data = await this.prisma.stackRecord.delete({
            where: {
                id: ID,
                userId: userID,
                seedId: seedID,
                // status: PlantStatus.bloomed
            }
        })
        return data;
    }

    // ********************************* Seed's repository order by crud *******************************************************
    // createSeed()
    //
    async createSeed(dto: createSeedDTO, icaonPath: string, stagePaths: string[]){
        const data = await this.prisma.seed.create({
            data: {
                nameEng: dto.nameEng,
                nameTH: dto.nameTH,
                description: dto.description,
                growthDays: dto.growthDays,
                icon: icaonPath,
                renderType: dto.renderType,
                imageStages: stagePaths,
                animationFile: dto.animationFile,
                animationKey: dto.animationKey,
                rarity: dto.rarity,
                emotionTag: dto.emotionTag,
                unlockCondition: dto.unlockCondition,
            }
        })
        return data
    }
    // getSeedByID()
    //
    async getSeedByID(seedID: string){
        const data = await this.prisma.seed.findFirst({
            where: {
                id: seedID
            }
        })
        return data;
    }
    // setSeedByID()
    //
    async setSeedByID(seedID: string, fieldName: string, value: any){
        // const data = this.prisma.seed.update({
        //     where: {
        //         id: seedID
        //     },
        //     data: {
        //         fieldName: value
        //     }
        // })
        // return data;
    }
    // deleteSeed()
    //
    async deleteSeed(seedID: string){
        const data = this.prisma.seed.delete({
            where: {
                id: seedID
            }
        })
        return data;
    }

    // ********************************* UserHasSeed's repository order by crud *******************************************************
    // createUserHasSeed()
    //
    async createUserHasSeed(dto: createUserHasSeedDTO){
    const data = await this.prisma.userHasSeed.create({
        data: {
            userId: dto.userId,
            seedId: dto.seedId
        }
    })
    return data
    }
    // getUserHasseed()
    //
    async getAllOwnedSeed(userId: string){
        const data = await this.prisma.userHasSeed.findMany({
            where: {
                userId: userId
            }
        })
        return data
    }

    // getOwnedSeedByID()
    //
    async getOwnedSeedByID(dto: createUserHasSeedDTO){
        const data = await this.prisma.userHasSeed.findFirst({
            where: {
                userId: dto.userId,
                seedId: dto.seedId
            }
        })
        return data
    }

   async setUserHasSeed(){

   }

   async deleteUserHasSeed(){

   }

    
}