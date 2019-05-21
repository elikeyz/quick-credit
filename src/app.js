import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import router from './routes';
import swaggerDocument from '../swagger.json';
import sendSuccessResponse from './utils/helpers/sendSuccessResponse';
import sendErrorResponse from './utils/helpers/sendErrorResponse';
import createTables from './models/createTables';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
createTables();
app.use('/api/v1', router);

app.get('/', (req, res) => {
  sendSuccessResponse(res, 200, { message: 'Welcome to Quick Credit API Version 1. Navigate to /api-docs for the API Documentation. Written by Elijah Enuem-Udogu' });
});

app.all('*', (req, res) => {
  sendErrorResponse(res, 404, 'This route is not available');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Quick Credit app listening at port ${port}`);
});

export default app;
