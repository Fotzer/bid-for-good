import express from 'express';
import morgan from './config/morgan';
import helmet from 'helmet';
import compression from 'compression';
import xss from './middlewares/xss';
import cors from 'cors';
import mainController from './controllers';

const app = express();

// set up logging
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));

app.use('/', mainController);

export default app;
