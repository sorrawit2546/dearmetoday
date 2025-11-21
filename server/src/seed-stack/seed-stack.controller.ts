import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  HttpCode,
  Param,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { SeedStackService } from './seed-stack.service';

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
}
