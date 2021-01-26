import {Connection, createConnection} from 'typeorm';
import {Cluster} from './entity/Cluster';
import {Module} from './entity/Module';
import {CourseOffering} from './entity/CourseOffering';
import {loadUFindUrl} from './utils';
import {extractLastModified, extractOfferedCourses} from './parser';
import {compareAsc} from 'date-fns';

const semesterIds = {
    '2019S': 226927,
    '2019W': 234463,
    '2020S': 238450,
    '2020W': 249370,
    '2021S': 259544
};

export class Crawler {
    connection: Connection;

    async init() {
        this.connection = await createConnection();
        console.log('Connected to DB');
    }

    async stop() {
        await this.connection.close();
    }

    async cleanDatabase() {
        let clusterRepository = this.connection.getRepository(Cluster);
        await clusterRepository.delete({});

        let moduleRepository = this.connection.getRepository(Module);
        await moduleRepository.delete({});

        let offeringRepository = this.connection.getRepository(CourseOffering);
        await offeringRepository.delete({});
    }

    async updateSemester(semester: string) {
        let html = await loadUFindUrl(semesterIds[semester]);
        let {clusters, offerings} = await extractOfferedCourses(html);
        console.log('Courses extracted for', semester);

        let clusterRepository = this.connection.getRepository(Cluster);
        let offeringRepository = this.connection.getRepository(CourseOffering);

        let latestOffering = await offeringRepository.find({
            where: {semester: offerings[0].semester, year: offerings[0].year},
            select: ['updatedAt'],
            order: {
                updatedAt: 'DESC'
            }
        });

        let lastModifiedDate = extractLastModified(html);
        if (latestOffering[0] && compareAsc(latestOffering[0].updatedAt, lastModifiedDate) >= 0) {
            console.log('Already Up to Date with', semester);
            return;
        }
        await clusterRepository.save(clusters, {transaction: true});
        await offeringRepository.save(offerings, {transaction: true});
        console.log(`Database updated for ${semester}`);
    }

    async updateAllSemesters() {
        for (let semester in semesterIds)
            await this.updateSemester(semester);
    }

    async printAllOfferings() {
        let offeringRepository = this.connection.getRepository(CourseOffering);
        let offerings = await offeringRepository.find();
        for (let offering of offerings)
            console.log(offering);
    }
}
