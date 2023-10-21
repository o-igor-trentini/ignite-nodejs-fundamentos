import http from 'node:http';
import {json} from './middlewares/json.js';
import {routes} from "./routes.js";


const server = http.createServer(async (req, res) => {
    const {method, url} = req;

    await json(req, res);

    const route = routes.find((route) => route.method === method && route.path.test(url));

    if (!route) return res.writeHead(404).end();

    const routeParams = url.match(route.path);
    req.params = {...routeParams.groups}

    route.handler(req, res);
})

server.listen(3000);
