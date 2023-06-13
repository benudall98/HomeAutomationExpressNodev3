import 'reflect-metadata';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';
import './routes/Author';
import './routes/Book';
import express from 'express';

/** Initialize the inversify container */
const container = new Container();

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Mongo connected successfully.');
        StartServer();
    })
    .catch((error) => Logging.error(error));

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
    // start the server
    const server = new InversifyExpressServer(container);

    server.setConfig((app) => {
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
    });

    server.setErrorConfig((app) => {
        app.use((req, res, next) => {
            const error = new Error('Not found');
            Logging.error(error);
            res.status(404).json({
                message: error.message
            });
        });
    });

    const app = server.build();
    app.listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`));
};
