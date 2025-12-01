import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SeedStackRepository } from './seed-stack.repository';
import { error } from 'console';
import { createSeedDTO } from './dto/seed/createSeed.dto';


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
    // This 
    async createDefaultStackRecord(userID: string){
        try{
            const seedID: string = 'default seedId'
            const result = this.repository.createStackRecord(userID, seedID)
        }catch (error) {
            console.log(error);
        }
    }
    // getStackRecordByID()
    // This function are service for get stack record by id
    async getStackRecordByID(userID: string){
        try{
            const result = this.repository.getStackRecordByID(userID);
        }catch (error) {
            console.log(error);
        }
    }
    // setStackRecordByID()
    // This ใช้ตอนเขียน หาว่ามีมั้ย -> มีให้อัปเดท -> ไม่มีสร้างใหม่ -> คืนค่า
    async setStackRecordByID(userID: string){
        try{
            const find = this.getStackRecordByID(userID)
            if(find){
                const result = this.repository.setStackRecordByID(userID)
            }else{
                const result = this.createDefaultStackRecord(userID)
            }
        }catch (error) {
            console.log(error);
        }
    }
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
    async createUserHasSeed(){

    }
    async getUserHasSeedByID(){

    }
    async setUserHasSeed(){

    }
    async deleteUserHasSeed(){
        
    }
}
