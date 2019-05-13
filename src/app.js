import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import router from './utils/routes';
import swaggerDocument from '../swagger.json';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.status(200).send({
    status: 200,
    data: {
      message: 'Welcome to Quick Credit API Version 1. Navigate to /api-docs for the API Documentation. Written by Elijah Enuem-Udogu',
    },
  });
});

const server = app.listen((process.env.PORT || 3000), () => {
  const { port } = server.address();
  // eslint-disable-next-line no-console
  console.log(`Quick Credit app listening at port ${port}`);
});

export default app;
