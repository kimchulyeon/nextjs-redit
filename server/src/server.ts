import express from 'express';
import morgan from 'morgan';
import {AppDataSource} from './data-source';
import authRoutes from './routes/auth';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
const origin = 'http://localhost:3000';

app.use(express.json());
app.use(morgan('dev')); // dev short common combined

dotenv.config();

app.use(
  cors({
    origin,
    credentials: true,
  })
);

app.get('/', (_, res) => res.send('running'));
app.use('/api/auth', authRoutes);

let port = 4000;

app.listen(port, async () => {
  console.log(`server running at http://localhost:${port}`);

  AppDataSource.initialize()
    .then(async () => {
      console.log('DB init');
    })
    .catch(error => console.log(error));
});
