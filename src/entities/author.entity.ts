import { IsNotEmpty, Length } from 'class-validator';
import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';


@Entity('authors')
class Author {
    @PrimaryColumn()
    uuid: string;

    @Column()
    @IsNotEmpty()
    @Length(3.255)
    name: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    constructor() {
        if (!this.uuid) {
            this.uuid = uuidV4();
        }
    }
}

export default Author