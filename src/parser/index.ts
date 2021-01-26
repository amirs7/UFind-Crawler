import {Course} from '../entity/Course';
import cheerio from 'cheerio';
import {parse} from 'date-fns';
import {Module} from '../entity/Module';
import {Cluster} from '../entity/Cluster';
import {CourseOffering} from '../entity/CourseOffering';
import _ from 'lodash';

function createCluster(rawCluster: string) {
    let tokens = /(.*)\s\((.*) ECTS\)/.exec(rawCluster);
    if (!tokens || tokens.length < 2)
        console.log(rawCluster, tokens);
    let ects = tokens[2];
    if (ects.indexOf('-') !== -1)
        ects = ects.replace('0-', '');
    return new Cluster(tokens[1], Number(ects));
}

function createModule(rawModule: string) {
    let tokens = /Module\s([^\s]+)\s(.*)\s\((.*) ECTS\)/.exec(rawModule);
    if (!tokens || tokens.length < 2)
        console.log(rawModule, tokens);
    return new Module(tokens[1], tokens[2], Number(tokens[3]));
}

function getYearSemester(rawYearSemester: string) {
    let tokens = /([\d]{4})([\w])/.exec(rawYearSemester);
    if (tokens) {
        return {year: Number(tokens[1]), semester: tokens[2]};
    }
    return null;
}

function extractLastModified(html: string) {
    const $ = cheerio.load(html);
    let dateString = $('.time').text();
    dateString = dateString.slice(3);
    let dateFormat = 'dd.MM.yyyy HH:mm';
    return parse(dateString, dateFormat, new Date());
}

async function extractOfferedCourses(html: string) {
    const $ = cheerio.load(html);
    let {year, semester} = getYearSemester($('.current').text());
    console.log(`Courses fetched for ${year} ${semester} Semester`)
    let clusters: Cluster[] = [];
    let it = $('.list.level1');
    let cluster: Cluster;
    let module: Module;
    let modules = {};
    let offerings = {};
    it = it.first();
    while (it.hasClass('list')) {
        if (it.hasClass('level1')) {
            cluster = createCluster(it.text());
            clusters.push(cluster);
        }
        if (it.hasClass('level2')) {
            module = createModule(it.text());
            if (modules.hasOwnProperty(module.code))
                module = modules[module.code];
            cluster.addModule(module);
        }
        if (it.hasClass('course')) {
            let name = it.children('.what').text();
            let number = Number(it.children('.number').text());
            let type = it.children('.type').text();
            let course = new Course(number, type, name);
            module.addCourse(course);
            let offering = new CourseOffering(year, semester);
            offering.course = course;
            offerings[course.number] = offering;
        }
        it = it.next();
    }
    return {clusters, offerings: _.values(offerings)};
}

export {
    extractOfferedCourses,
    extractLastModified
}
