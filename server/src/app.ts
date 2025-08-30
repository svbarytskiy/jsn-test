import express from 'express';
import cors from 'cors';
import superheroRoutes from './routes/superhero.routes';
import { handleServerError } from './utils/error-handler';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(fileUpload());
app.use('/api/superheroes', superheroRoutes);
app.get('/', (req, res) => res.send('API is running'));
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));
console.log(path.join(__dirname, '..', 'public', 'images'));
app.use(handleServerError);

export default app;
