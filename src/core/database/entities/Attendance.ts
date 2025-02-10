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
    id:string

    @Column({
        length: 255,
    })
    date:string
    // @Column({
    //     type: 'enum',
    //     length: 255,
    //     enum: DOMAIN

    // })
    // domain:DOMAIN

    
}