import { Controller, Get, Post, Put, Delete, Req, Res} from "@nestjs/common";
import type { Request, Response} from "express";

@Controller('seeds')
export class SeedsController {
    // This function is used to fetch data in stack table
    @Get("stacks")
    GetStack(@Req() req: Request): string{
        return 
    }

    // This function is used to insert data in stack table
    @Post("stacks")
    SetStack(): string{
        return
    }

    @Put("stacks")
    Update(): String{
        return
    }

    @Delete("stacks")
    DeleteStack(): string{
        return
    }
}