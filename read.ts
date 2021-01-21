import * as fs from 'fs';

(async () => {
    let html = String(fs.readFileSync('./resources/2021-summer.html'));
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
