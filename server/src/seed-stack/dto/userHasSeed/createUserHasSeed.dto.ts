import { Type } from "class-transformer";
import { IsString, IsUUID } from "class-validator"

export class createUserHasSeedDTO {

    @IsUUID()
    userId: string;

    @IsUUID()
    seedId: string;

}