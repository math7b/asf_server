import { FastifyInstance } from "fastify";
import { pubSub } from "../../utils/pub-sub";

export async function postRoutes(app: FastifyInstance) {
    app.get('/realtime/posts', { websocket: true }, (connection) => {
        pubSub.subscribe('postdetails', (message) => {
            connection.send(JSON.stringify(message));
        });
    });
    app.get('/realtime/user/:userId', { websocket: true }, (connection) => {
        pubSub.subscribe('userdetails', (message) => {
            connection.send(JSON.stringify(message));
        });
    });
    app.get('/realtime/bee', { websocket: true }, (connection) => {
        pubSub.subscribe('beedata', (message) => {
            connection.send(JSON.stringify(message));
        });
    });
}
