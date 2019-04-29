import express from 'express';
import bodyParser from 'body-parser';
import router from './utils/routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.status(200).send({
    status: 200,
    data: 'Welcome to Quick Credit API Version 1. Written by Elijah Enuem-Udogu',
  });
});

const server = app.listen((process.env.PORT || 3000), () => {
  const { port } = server.address();
  console.log(`Quick Credit app listening at port ${port}`);
});

export default app;
