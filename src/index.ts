import {createConnection} from 'typeorm';
import {extractOfferedCourses} from './parser';
import {Cluster} from './entity/Cluster';
import {loadUFindUrl} from './utils';
import {Module} from './entity/Module';
import {CourseOffering} from './entity/CourseOffering';
import _ from 'lodash';

const pathValues = {
    '2019S': 226927,
    '2019W': 234463,
    '2020S': 238450,
    '2020W': 249370,
    '2021S': 259544
};

async function cleanDatabase(connection) {
    let clusterRepository = connection.getRepository(Cluster);
    await clusterRepository.delete({});

    let moduleRepository = connection.getRepository(Module);
    await moduleRepository.delete({});

    let offeringRepository = connection.getRepository(CourseOffering);
    await offeringRepository.delete({});
}

async function updateDatabase(connection, pathValue: number) {
    let html = await loadUFindUrl(pathValue);
    let {clusters, offerings} = await extractOfferedCourses(html);
    console.log(`Courses extracted for ${pathValue}`)

    let clusterRepository = connection.getRepository(Cluster);

    let offeringRepository = connection.getRepository(CourseOffering);

    await clusterRepository.save(clusters, {transaction: true});
    await offeringRepository.save(_.values(offerings), {transaction: true});
}

(async () => {
    let connection = await createConnection();
    await cleanDatabase(connection);
    for (let pathValue of _.values(pathValues)) {
        await updateDatabase(connection, pathValue);
        console.log(`Database updated for ${pathValue}`);
    }
    await connection.close();
})()
