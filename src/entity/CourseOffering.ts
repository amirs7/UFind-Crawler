import {Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {Course} from './Course';


@Entity()
export class CourseOffering {
    @PrimaryColumn()
    year: number;

    @PrimaryColumn()
    semester: string;

    @JoinColumn()
    @ManyToOne(() => Course, course => course.offerings, {primary: true, eager: true, onDelete: 'CASCADE'})
    course: Course;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(year: number, semester: string) {
        this.year = year;
        this.semester = semester;
    }
}
