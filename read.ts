import * as fs from 'fs';
import {extractLastModified, extractOfferedCourses} from './src/parser';
import {createConnection} from 'typeorm';
import {compareAsc} from 'date-fns';
import {CourseOffering} from './src/entity/CourseOffering';
import {Cluster} from './src/entity/Cluster';
import _ from 'lodash';

(async () => {
    // let html = String(fs.readFileSync('./resources/2020-summer.html'));
    let html = String(fs.readFileSync('./resources/2020-winter.html'));
    let {clusters, offerings} = await extractOfferedCourses(html);
    let connection = await createConnection();
    let clusterRepository = connection.getRepository(Cluster);
    let offeringRepository = connection.getRepository(CourseOffering);
    offerings = _.values(offerings);

    let latestCluster = await offeringRepository.find({
        where: {semester: offerings[0].semester},
        select: ['updatedAt'],
        order: {
            updatedAt: 'DESC'
        }
    });

    let lastModifiedDate = extractLastModified(html);
    if (latestCluster[0] && compareAsc(latestCluster[0].updatedAt, lastModifiedDate) >= 0) {
        console.log('Already Up to Date');
        return;
    }

    await clusterRepository.delete({});
    await clusterRepository.save(clusters, {transaction: true});

    await offeringRepository.delete({});
    await offeringRepository.save(offerings, {transaction: true});
    console.log('Extraction Done');
})()

// (async () => {
//     let html = await loadUFindUrl(238450);
//     let clusters = await extractOfferedCourses(html);
//     let connection = await createConnection();
//     let clusterRepository = connection.getRepository(Cluster);
//     await clusterRepository.delete({});
//     await clusterRepository.save(clusters);
//     console.log('Database Updated')
//     return;
// })();
//
