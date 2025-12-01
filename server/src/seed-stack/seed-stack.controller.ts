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

export interface SeedUploadFiles {
  icon: Express.Multer.File;
  imageStages: Express.Multer.File[];
}

@Controller('seed-stack')
export class SeedsController {
  constructor(private readonly service: SeedStackService) {}
  // ***************************************** Stack Record *********************************************************************
  // Get Method
  // This function is used to fetch data in stack table
  @Get('stack')
  GetStack(@Req() req: Request): string {
    return 'req';
  }
  // Post Method
  // This function is handle request that try to get stack record by id
  @Post('stack')
  @HttpCode(201)
  getStackRecordByID(@Param('id') id:string): string {
    this.service.getStackRecordByID(id);
    return 'get stack record by ID';
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
  //   FileInterceptor('icon', {
  //   storage: diskStorage({
  //     destination: './seed/icon',
  //     filename: (req, icon, cb) => {
  //       const unique = 'seed' + Date.now() + '-' + Math.round(Math.random() * 1e9);
  //       cb(null, unique + extname(icon.originalname));
  //     }
  //   })
  // }),
  // FilesInterceptor('imageStages', 10, {
  //   storage: diskStorage({
  //     destination: './seed/stage',
  //     filename: (req, img, cb) => {
  //       const unique = 'stage' + Date.now() + '-' + Math.round(Math.random() * 1e9);
  //       cb(null, unique + extname(img.originalname));
  //     }
  //   })
  // })
  )
  createSeed(
    @Body() dto: createSeedDTO,
    // @UploadedFile() icon: Express.Multer.File,
    // @UploadedFiles() imageStages: Express.Multer.File[],
    @UploadedFiles() files: SeedUploadFiles
  ){ 
    console.log('controller')
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
}
