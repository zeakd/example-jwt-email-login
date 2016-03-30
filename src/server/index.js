import express from 'express';

const app = express();

app.set('port', 3000)

app.get('/', (req, res) => {
    res.send('hello');
})

export default app;