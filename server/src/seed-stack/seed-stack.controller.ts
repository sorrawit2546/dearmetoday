import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  HttpCode,
  Param,
  UseInterceptors,
  Body,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { SeedStackService } from './seed-stack.service';
import { FilesInterceptor, FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { createSeedDTO } from './dto/seed/createSeed.dto';
import { createUserHasSeedDTO } from './dto/userHasSeed/createUserHasSeed.dto';
import { createStackRecordDTO } from './dto/stackRecord/createStackRecord.dto';

export interface SeedUploadFiles {
  icon: Express.Multer.File;
  imageStages: Express.Multer.File[];
}

@Controller('seed-stack')
export class SeedsController {
  constructor(private readonly service: SeedStackService) {}

  // ***************************************** Stack Record *********************************************************************
  // This function is used to fetch data in stack table
  @Get('stack')
  GetStack(@Req() req: Request): string {
    return 'req';
  }
  // Post Method
  // This function is handle request that try to get stack record by id
  @Post('create-stack')
  @HttpCode(201)
  getStackRecordByID(
    @Body() dto: createStackRecordDTO
  ){
    return this.service.createStackRecord(dto)
  }
  // This function is handle request that try to create stack record
  @Post('create-stack')
  @HttpCode(201)
  creatStackRecord(): string {
    return 'create stack record'
  }
  // Put Method
  @Put('stacks')
  Update(): string {
    return;
  }
  // Delelte Method
  @Delete('stacks')
  DeleteStack(): string {
    return;
  }


  // ***************************************** Seed *********************************************************************
  // This end-point is used to create seed
  @Post('seed')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {name: 'icon', maxCount: 1},
        {name: 'imageStages', maxCount: 10},
      ],
      {
        storage:diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const prefix = file.fieldname === 'icon' ? 'seed' : 'stage';
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, prefix + unique + extname(file.originalname));
          }
        })
    })
  )
  createSeed(
    @Body() dto: createSeedDTO,
    @UploadedFiles() files: SeedUploadFiles
  ){ 
    return this.service.createSeed(dto, files);
  }

  @Put()
  updateSeed(): string{
    return;
  }

  @Delete()
  deleteSeed(): string{
    return
  }

  // ***************************************** UserHasSeed *********************************************************************
  // This end-point is used to create record in user
  @Post('claim-seed')
  createUserHasSeed(
    @Body() dto: createUserHasSeedDTO
  ){
    return this.service.createUserHasSeed(dto)
  }
  //
  @Post('isowned-seed')
  @HttpCode(200)
  getOwnedSeedByID(
    @Body() dto: createUserHasSeedDTO
  ){
    return this.service.getOwendSeedByID(dto)
  }
}
