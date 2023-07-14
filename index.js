const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');

const contestRouter = require('./routes/schedule');
const ratingRouter = require('./routes/rating');

router.use('/schedule', contestRouter);
router.use('/rating/', ratingRouter);

router.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(cors({ origin: true, credentials: true }));

app.use('/', router);

app.listen(7000, () => {
    console.log('Server is running on port 7000');
});
