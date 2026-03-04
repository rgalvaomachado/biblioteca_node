import { IsNotEmpty, Length } from 'class-validator';
import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import Author from './author.entity';
import Subject from './subject.entity';

@Entity('books')
class Book {
    @PrimaryColumn()
    uuid: string;

    @Column()
    @IsNotEmpty()
    @Length(3.255)
    name: string;

    @Column({
        name: 'author_uuid',
        type: 'varchar',
        nullable: false
    })   
    @IsNotEmpty()
    authorUUID: string

    @ManyToOne(() => Author)
    @JoinColumn({ name: 'author_uuid' })
    author: Author;

    @Column({
        name: 'subject_uuid',
        type: 'varchar',
        nullable: false
    })   
    @IsNotEmpty()
    subjectUUID: string

    @ManyToOne(() => Subject)
    @JoinColumn({ name: 'subject_uuid' })
    subject: Subject;

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

export default Book