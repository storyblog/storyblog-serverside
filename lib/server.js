'use srict';

/* ----------------------- load enviroument variables ----------------------- */

require('dotenv').config();

/* -------------------------- require dependencies -------------------------- */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const morgan = require('morgan');

/* -------------------------- initial server setup -------------------------- */

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

/* ---------------------- express bodyParser middleware --------------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------ internal modules || route deenitions ------------------ */

const signUpRouter = require('../src/routes/signup');
const signInRouter = require('../src/routes/signin');
const signOutRouter = require('../src/routes/signout');
const router = require('../src/router');

app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(router);

/* ---------------------------- error middleware ---------------------------- */

const notFoundError = require('../middileware/errors/404');
const serverError = require('../middileware/errors/500');

/* ------------------------------ handle errors ----------------------------- */

//404 errors
app.use('*', notFoundError);
//500 errors
app.use(serverError);

/* -------------------------------------------------------------------------- */

module.exports = {
  server: app,
  start: (port) => {
    server.listen(port, () => console.log(`Listening on port ${port}`));
  },
};
