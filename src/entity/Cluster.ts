import {Column, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {Module} from './Module';

@Entity()
export class Cluster {
    @PrimaryColumn()
    name: string;

    @Column()
    ects: number;

    @JoinTable()
    @ManyToMany(() => Module, module => module.clusters, {cascade: true})
    modules: Module[];

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(name: string, ects: number) {
        this.name = name;
        this.ects = ects;
    }

    addModule(module: Module) {
        if (!this.modules)
            this.modules = [];
        this.modules.push(module);
    }
}
