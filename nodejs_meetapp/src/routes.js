import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import MeetupController from './app/controllers/MeetupController';
import FileController from './app/controllers/FileController';
import SubscriptionController from './app/controllers/SubscriptionController';

import appMiddleware from './app/middlewares/app';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// App variables
routes.use(appMiddleware);

// Users
routes.post('/users', UserController.store);
// Sessions
routes.post('/sessions', SessionController.store);

// ################
// Token validation
routes.use(authMiddleware);

// Users
routes.put('/users', UserController.update);
// Meetups
routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.delete('/meetups/:id', MeetupController.delete);
// Subscriptions
routes.get('/subscriptions', SubscriptionController.index);
routes.post('/meetups/:id/subscribe', SubscriptionController.store);
routes.delete('/meetups/:id/unsubscribe', SubscriptionController.delete);
// Files
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
