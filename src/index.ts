import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import routes from './routes';

require('dotenv').config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use(routes);

app.listen(port, () => {
    console.log(`app is running in ${port}`);
});