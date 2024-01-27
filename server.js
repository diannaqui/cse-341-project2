const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const createError = require('http-errors');


const port = process.env.PORT || 3000;
const app = express();

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', require('./routes'));


  
// Error 404
app.use((req, res, next) => {
  // const err = new Error('Not Found');
  // err.status = 404;
  // next(err);
  next(createError(404, 'Not found'))
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
});



mongodb.initDb((err) => {
if (err) {
    console.log(err);
} else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
}
});
  