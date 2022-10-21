import express from 'express';
import morgan from 'morgan';
import {AppDataSource} from './data-source';

const app = express();

app.use(express.json());
app.use(morgan('dev')); // dev short common combined

app.get('/', (_, res) => res.send('running'));

let port = 4000;

app.listen(port, async () => {
  console.log(`server running at http://localhost:${port}`);

  AppDataSource.initialize()
    .then(async () => {
      console.log('DB init');
    })
    .catch(error => console.log(error));
});
