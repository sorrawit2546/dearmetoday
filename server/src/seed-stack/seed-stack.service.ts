import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SeedStackRepository } from './seed-stack.repository';
import { error } from 'console';
import { createSeedDTO } from './dto/seed/createSeed.dto';
import { createUserHasSeedDTO } from './dto/userHasSeed/createUserHasSeed.dto';
import { createStackRecordDTO } from './dto/stackRecord/createStackRecord.dto';


export interface SeedUploadFiles {
  icon: Express.Multer.File;
  imageStages: Express.Multer.File[];
}
@Injectable()
export class SeedStackService {
    constructor(
        private readonly repository: SeedStackRepository
    ){}

    // ************************************* Stack Record *****************************************************************
    // createStackRecord()
    // This function is used to create stack record.
    async createStackRecord(dto: createStackRecordDTO){
        try{
            if(await this.getStackRecordByID(dto.userId)){
                return {
                    message: "You are planted.!"
                }
            }else{
                this.randomPlant(dto.userId)
            }
        }catch(error){
            console.log(error)
        }
    }
    // randomPlant()
    // This function is used to creat default stack record by random seed.
    async randomPlant(userID: string){
        try{
            const ownedSeed = this.getAllOwnedSeed(userID);
            const randomSeed = (await ownedSeed).at(Math.random() * (await ownedSeed).length-1)
            await this.specificPlant(userID, randomSeed.seedId);
        }catch (error) {
            console.log(error);
        }
    }
    // specificPlant()
    // This function is used to plant a specific seed
    async specificPlant(userID: string, seedID: string){
        try{    
            return this.repository.createStackRecord(userID, seedID);
        }catch(error){
            console.log(error)
        }
    }
    // getStackRecordByID()
    // This function are service for get stack record by id
    async getStackRecordByID(userID: string){
        try{
            return this.repository.getStackRecordByID(userID)
        }catch (error) {
            console.log(error);
        }
    }
    // setStackRecordByID()
    // This ใช้ตอนเขียน หาว่ามีมั้ย -> มีให้อัปเดท -> ไม่มีสร้างใหม่ -> คืนค่า
    // async setStackRecordByID(dto: cre){
    //     try{
    //         const find = this.getStackRecordByID(userID)
    //         if(find){
    //             const result = this.repository.setStackRecordByID(userID)
    //         }else{
    //             const result = this.createDefaultStackRecord(userID)
    //         }
    //     }catch (error) {
    //         console.log(error);
    //     }
    // }
    // deleteStackRecordByID()
    // This
    async deleteStackRecordByID(ID: string, userID: string, seedID: string){
        try{
            const result = this.repository.deleteStackRecordByID(ID, userID, seedID)
        }catch (error) {
            console.log(error);
        }
    }

    // ********************************* Seed's services order by crud *******************************************************
    // createSeed()
    // This service ใช้สำหรับการ สร้าง seed เข้าสู่ระบบ
    async createSeed(dto: createSeedDTO, files: SeedUploadFiles){
        try{
            console.log('services')
            
            //
            const iconPath = files.icon?.[0]?.filename; 
            const stagePaths = files.imageStages?.map(f => f.filename) ?? [];
            console.log('icaonPath : ', iconPath)
            console.log('stagePaths : ', stagePaths)
            // dto.icon = iconPath;
            // dto.imageStages = stagePaths;
            return this.repository.createSeed(dto, iconPath, stagePaths)
        }catch (error) {
            console.log(error);
        }
    }


    // getSeed()
    //
    async getSeed(seedID: string){
        try {
            const result = this.repository.getSeedByID(seedID)
        } catch (error) {
            console.log(error);
        }
    }
    // setSeed()
    // 
    async setSeed(seedID: string, fieldName: string, value: any){
        try{
            const result = this.repository.setSeedByID(seedID, fieldName, value);
        }catch(error){
            console.log(error);
        }
    }
    // deleteSeed()
    //
    async deleteSeed(seedID: string){
        try{
            const result = this.repository.deleteSeed(seedID);
        }catch(error){
           console.log(error); 
        }
    }

    // ********************************* Garden's services order by crud ************************************************************
    async createGardenRecord(){

    }
    async getGardenRecordByID(){

    }
    async setGardenRecord(){

    }
    async deleteGardenRecord(){

    }
    // ********************************* UserHasSeed's services order by crud *******************************************************
    // createUseerHasSeed()
    // This function is used to ....
    async createUserHasSeed(dto: createUserHasSeedDTO){
        try{
            if(await this.getOwendSeedByID(dto)){
                return {
                    message: "You are already owned this seed.!"
                }
            }else{
                return this.repository.createUserHasSeed(dto)
            }
        }catch(error){
            console.log(error)
        }
    }
    // getAllOwnedSeed()
    // This function is used to find all seed that has been owned by user.
    async getAllOwnedSeed(userID: string){
        try{
            return this.repository.getAllOwnedSeed(userID)
        }catch(error){
            console.log(error)
        }
    }

    // getOwnedSeedByID()
    //
    async getOwendSeedByID(dto: createUserHasSeedDTO){
        try{
            return this.repository.getOwnedSeedByID(dto)
        }catch(error){
            console.log(error)
        }
    }
    async setUserHasSeed(){

    }
    async deleteUserHasSeed(){
        
    }
}
