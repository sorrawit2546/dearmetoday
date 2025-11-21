import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SeedStackRepository{
    constructor(
        private prisma: PrismaService
    ){}

    // ************************************* Stack Record *****************************************************************
    // createStackRecord()
    // 
    async createStackRecord(userID: string, seedID: string){
        //    const data = await this.prisma.StackRecord.create({
        //         data: {
        //             stack: 1,
        //             status: 'PlantStatus.growing',
        //             userId: userID,
        //             seedId: seedID,
        //         }
        //    })
        //    return data;
    }
    // getStackRecordByID() 
    // 
    async getStackRecordByID(userID: string){
        // const data = await this.prisma.StackRecord.findFirst({
        //     where: {
        //         userId: userID,
        // }
        // })
        // return data;
    }
    // setStackRecordByID()
    //
    async setStackRecordByID(userID: string){
        // const data = await this.prisma.StackRecord.update({
        //     where: {
        //         userId: userID
        //     },
        //     data: {
        //         stack: stack++,
        //         updatedAt: new Date()
        //     }
        // })
        // return data;
    }
    // deleteStackRecordByID()
    //
    async deleteStackRecordByID(ID: string, userID: string, seedID: string){
        // const data = await this.prisma.StackRecord.delete({
        //     where: {
        //         id: ID,
        //         userId: userID,
        //         seedId: seedID,
        //         status: PlantStatus.bloomed
        //     }
        // })
        // return data;
    }

    // ********************************* Seed's repository order by crud *******************************************************
    // createSeed()
    //
    async creteSeed(nameEng: string, nameTH: string, description: string, growthDays: Number, icon: string, renderType: string, imageStages: string[], animationFile: string, animationKey: string, rarity: string, emotionTag: string, unlockCondition: string){
        // const data = await this.prisma.Seed.create({
        //     data: {
        //         nameEng: nameEng,
        //         nameTH: nameTH,
        //         description: description,
        //         growthDays: growthDays,
        //         icon: icon,
        //         renderType: renderType,
        //         imageStages: imageStages,
        //         animationFile: animationFile,
        //         animationKey: animationKey,
        //         rarity: rarity,
        //         emotionTag: emotionTag,
        //         unlockCondition: unlockCondition
        //     }
        // })
        // return data
    }
    // getSeedByID()
    //
    async getSeedByID(seedID: string){
        // const data = await this.prisma.Seed.findFirst({
        //     where: {
        //         id: seedID
        //     }
        // })
        // return data;
    }
    // setSeedByID()
    //
    async setSeedByID(seedID: string, fieldName: string, value: any){
        // const data = this.prisma.Seed.update({
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
        // const data = this.prisma.Seed.delete({
        //     where: {
        //         id: seedID
        //     }
        // })
        // return data;
    }

    
}