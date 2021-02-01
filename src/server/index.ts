import express from 'express';
import path from 'path';
import mustacheExpress from 'mustache-express';
import data from './data';
import _ from 'lodash';

const app = express();

app.engine('html', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

const port = 3000;

function generateGraph() {
    let graph = {} as any;
    let temp = _.mapValues(data, o => o.courses);
    temp = _.values(temp);
    temp = _.flatten(temp);
    temp = _.uniq(temp);
    let clusterMapping = {};
    for (let cluster in data) {
        for (let mod of data[cluster].courses)
            clusterMapping[mod] = cluster;
    }
    let nodes = temp.map(o => ({id: o, label: o.toUpperCase(), group: clusterMapping[o]}));
    let edges = [];
    for (let cluster of _.values(data)) {
        for (let mod of cluster.courses) {
            let edge = {
                from: cluster.gatekeeper,
                to: mod
            }
            if (edge.from !== edge.to)
                edges.push(edge);
        }
    }
    graph.nodes = nodes;
    graph.edges = edges;
    return graph;
}

console.log(generateGraph());

app.get('/', async (req, res) => {
    let graph = generateGraph();
    res.render('index', {title: 'hi', graph: JSON.stringify(graph)});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
