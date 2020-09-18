'use strict';

/* ----------------------- load enviroument variables ----------------------- */

require('dotenv').config();

/* -------------------- dependencies and internal modules ------------------- */

const mongoose = require('mongoose');

const server = require('./lib/server');

/* -------------------------- connecting to mongoDB ------------------------- */

const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
  
mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(console.log('\n**mongoDB connected**\n'));

/* --------------------------- starting the server -------------------------- */

server.start(process.env.PORT);
