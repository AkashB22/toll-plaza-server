const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./services/swagger.service');
const receiptsRoute = require('./routes/receipts.route');
const servicesRoute = require('./routes/services.route');
const app = express();
const { WHITELIST } = process.env;
const whitelist = (WHITELIST) ? JSON.parse(WHITELIST) : [];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/swagger-v3.json', (req, res) => {
  return res.status(200).json(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/receipts', cors(corsOptions), receiptsRoute);
app.use('/services', cors(corsOptions), servicesRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send err response
  res.status(err.status || 500);
  const error = { "message": err.message }
  res.json(error);
});

module.exports = app;
