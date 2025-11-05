import { Controller, Get, Post, Put, Delete, Req, Res, HttpCode} from "@nestjs/common";
import type { Request, Response} from "express";

@Controller('seeds')
export class SeedsController {
    // This function is used to fetch data in stack table
    @Get("stacks")
    GetStack(@Req() req: Request): string{
        console.log(req)
        return "req"
    }

    // This function is used to insert data in stack table
    @Post("stacks")
    @HttpCode(201)
    SetStack(): string{
        return "Created"
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