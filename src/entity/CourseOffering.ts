import {Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {Course} from './Course';

export enum Semester {
    S, W
}

@Entity()
export class CourseOffering {
    @PrimaryColumn()
    year: number;

    @PrimaryColumn()
    semester: Semester;

    @JoinColumn()
    @ManyToOne(() => Course, course => course.offerings, {primary: true, eager: true, onDelete: 'CASCADE'})
    course: Course;

    constructor(year: number, semester: Semester) {
        this.year = year;
        this.semester = semester;
    }
}