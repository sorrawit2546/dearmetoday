import { IsUUID } from "class-validator";

export class createStackRecordDTO{

    @IsUUID()
    userId: string;
}