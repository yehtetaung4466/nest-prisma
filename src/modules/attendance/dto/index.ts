import { IsEnum } from "class-validator";
import { DOMAIN } from "src/shared/enums/domain";


export class AttendanceDto {
    @IsEnum(DOMAIN)
    domain:DOMAIN
}