import * as fs from 'fs';
import {extractLastModified, extractOfferedCourses} from './src/parser';
import {createConnection} from 'typeorm';
import {Cluster} from './src/entity/Cluster';
import {compareAsc} from 'date-fns';

(async () => {
    let html = String(fs.readFileSync('./resources/2020-summer.html'));
    let {clusters} = await extractOfferedCourses(html);
    let connection = await createConnection();
    let clusterRepository = connection.getRepository(Cluster);
    await clusterRepository.delete({});
    await clusterRepository.save(clusters);
    let latestCluster = await clusterRepository.find({
        select: ['updatedAt'],
        order: {
            updatedAt: 'DESC'
        },
        take: 1
    });
    let lastModifiedDate = extractLastModified(html);
    if (compareAsc(latestCluster[0].updatedAt, lastModifiedDate) >= 0)
        console.log('Already Up to Date');
    else
        console.log('New data is added');

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
