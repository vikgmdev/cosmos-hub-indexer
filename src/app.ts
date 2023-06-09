import express, { Request } from 'express';
import morgan from 'morgan';
import { Config } from './config';

import CosmosRoutes from './api/routes';

const app = express();

app.use(express.json({ limit: Config.app.requestLimit }));
app.use(
  express.urlencoded({
    extended: true,
    limit: Config.app.requestLimit,
  }),
);

// Set API logging
morgan.token('params', (req: Request) => JSON.stringify(req.params));
morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms params :params body :body'));

// Inject endpoints to Express
app.use(CosmosRoutes);

export default app;
