import express from 'express';
import cors from 'cors';

import reminderRoutes from './routes/reminder.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/reminders', reminderRoutes);

app.get('/', (req, res) => {
    res.send('Remind Me API is running');
});

export default app;
