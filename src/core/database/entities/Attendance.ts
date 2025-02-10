import { DOMAIN } from "src/shared/enums/domain";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'attendance_records'})
export class Attendance {
    @PrimaryColumn({generated:'uuid'})
    syskey:string

    @Column({
        unique:true,
        length: 255,
    })
    user_id:string

    // @Column({
    //     length: 255,
    //     default:
    // })
    // date:Date
    
}