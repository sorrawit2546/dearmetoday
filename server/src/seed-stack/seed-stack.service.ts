import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SeedStackRepository } from './seed-stack.repository';
import { error } from 'console';

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
    //
    async createSeed(nameEng: string, nameTH: string, description: string, growthDays: Number, icon: string, renderType: string, imageStages: string[], animationFile: string, animationKey: string, rarity: string, emotionTag: string, unlockCondition: string){
        try{
            const result = this.repository.creteSeed(nameEng, nameTH, description, growthDays, icon, renderType, imageStages, animationFile, animationKey, rarity, emotionTag, unlockCondition);
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
