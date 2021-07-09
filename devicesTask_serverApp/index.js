import express from 'express'
import consign from 'consign'
cdconst cors = require('cors');

const app = express()

consign()
  .include('libs/middlewares.js')
  .then('routes')
  .include('libs/boots.js')
  .into(app)

  app.use(
    cors({
      origin: ['http://localhost:3000']
    })
  );


  app.use('/', require('./routes/devices'));

  module.exports = app;