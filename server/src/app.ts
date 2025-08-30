import express from 'express';
import cors from 'cors';
import superheroRoutes from './routes/superhero.routes';
import { handleServerError } from './utils/error-handler';
import fileUpload from 'express-fileupload';

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/api/superheroes', superheroRoutes);
app.use(handleServerError);
app.get('/', (req, res) => res.send('API is running'));

export default app;
