require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const User = require('./models/user.model');

require('./config/hbs.config');
require('./config/db.config');
const session = require('./config/session.config');

const app = express();


/**
 * Middlewares
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
// Iteration 2: configure session
app.use(session);

app.use((req, res, next) => {
  // la variable path se podrá usar desde cualquier vista de hbs (/register, /posts)
  res.locals.path = req.path;
  next();
});

app.use((req, res, next) => {
  // Iteration 2: load session user if exists at the session cookie and set the user at locals & request.
  res.locals.currentUser = req.session.currentUserId;
  if (req.session.currentUserId) {
    User.findById(req.session.currentUserId)
      .then((user) => {
        if (user) {
          res.locals.currentUser = user;
          req.currentUser = user;
        }else {
          req.session.currentUserId = undefined;
        }
        next();
      })
      .catch(next);
  }else {
    next();
  }
});

/**
 * View setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/**
 * Configure routes
 */
const router = require('./config/routes.config');
app.use('/', router);

app.use((req, res, next) => {
  next(createError(404, 'Page not found'));
});

app.use((error, req, res, next) => {
  console.error(error);
  let status = error.status || 500;

  res.status(status).render('error', {
    message: error.message,
    error: req.app.get('env') === 'development' ? error : {},
  });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Ready! Listening on port ${port}`);
});
