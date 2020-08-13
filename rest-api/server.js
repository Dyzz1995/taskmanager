require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDb } = require('./lib/mongoose-wrapper');
const authentication = require('./authentication');
const users = require('./users');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authentication);
app.use('/users', users);


connectDb().then(async (res) => {
    console.log('MongoDB connection: ', res.connection.readyState === 1 ? 'Connected' : 'Error');
    app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}!`));
  });
  