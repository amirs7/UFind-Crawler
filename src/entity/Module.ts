import {Column, Entity, ManyToMany, OneToMany, PrimaryColumn} from 'typeorm';
import {Course} from './Course';
import {Cluster} from './Cluster';

@Entity()
export class Module {
    @PrimaryColumn()
    code: string;

    @Column()
    name: string;

    @Column()
    ects: number;

    @OneToMany(() => Course, course => course.module, {cascade: true})
    courses: Course[];

    @ManyToMany(() => Cluster, cluster => cluster.modules, {eager: true, onDelete: 'CASCADE'})
    clusters: Cluster[];

    constructor(code: string, name: string, ects: number) {
        this.code = code;
        this.name = name;
        this.ects = ects;
    }

    addCourse(course: Course) {
        if (!this.courses)
            this.courses = [];
        this.courses.push(course);
    }
}
