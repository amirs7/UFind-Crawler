import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from 'typeorm';
import {Module} from './Module';
import {CourseOffering} from './CourseOffering';

export enum CourseType {
    VU, SE, LP, VO, UE
}

@Entity()
export class Course {
    @PrimaryColumn()
    number: number;

    @Column()
    name: string;

    @Column()
    type: CourseType;

    @ManyToOne(() => Module, module => module.courses, {eager: true, onDelete: 'CASCADE'})
    module: Module;

    @OneToMany(() => CourseOffering, offering => offering.course, {cascade: true})
    offerings: CourseOffering[];

    constructor(number: number, type: CourseType, name: string) {
        this.number = number;
        this.type = type;
        this.name = name;
    }

    addOffering(offering: CourseOffering) {
        if (!this.offerings)
            this.offerings = [];
        this.offerings.push(offering);
    }
}
