const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;
const clientPath = path.join(__dirname, 'client');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const keys = require('./keys');
const postRouter = require('./routes/post');

mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB connected.'))
    .catch(err => console.error(err));

const app = express();
app.use(bodyParser.json());
app.use('/api/post', postRouter);
app.use(express.static(clientPath));
app.listen(port, () => console.log(`Server has been started on port ${port}`));


