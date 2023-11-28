require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');
const db = require('./db/db_config');

const history = require('connect-history-api-fallback');

const isProduction = process.env.NODE_ENV === 'production';
// import all the express routes we will be using
const indexRouter = require('./routes/index');
const deedsRouter = require('./routes/deeds');
const usersRouter = require('./routes/users');
const sessionRouter = require('./routes/session');
const feedbackRouter = require('./routes/feedback');
const rewardsRouter = require('./routes/rewards');


// create our app
const app = express();
app.use(history());

// set up user session
app.use(session({
  secret: 'GoodDeeds',
  resave: true,
  saveUninitialized: true
}));

// allows us to make requests from POSTMAN
app.use(cors());

// set up the app to use dev logger
app.use(logger('dev'));

// accept json
app.use(express.json());

// https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
// allows object nesting in POST
app.use(express.urlencoded({ extended: false }));

// cookies for sessions
app.use(cookieParser());

// server html+css+js frontend
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, isProduction ?'dist': 'public')));

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// connect url hierarchies to our routers

app.use('/', indexRouter);
app.use('/api/deeds', deedsRouter);
app.use('/api/user', usersRouter);
app.use('/api/session', sessionRouter);
app.use('/api/feedback', feedbackRouter)
app.use('/api/reward', rewardsRouter);

app.all('*', (req, res) => {
  const errorMessage = `
  The following route is invalid: <b>${req.url}</b>
  <br><br>
  Here are the list of supported routes:
  <br>
  <br>
  <b>Deeds</b>
  <br>
  POST /api/deeds - Creates a new deed
  <br>
  GET /api/deeds - Get all deeds
  <br>
  DELETE /api/deeds - Deletes the deed with a specific id. 
  <br><br>
  <b>Users</b>
  <br>
  POST /api/user/ - Create a user
  <br>
  GET /api/user/:userID? - Get a username with given userID
  <br><br>
  <b>Session</b>
  <br>
  GET /api/session/ - Get a username in the session
  <br>
  POST /api/session - Sign in a user
  <br>
  DELETE /api/session - Sign out a user.
  <br>
`;

  res.status(404).send(errorMessage);
});

console.log("Running on localhost:3000...");

module.exports = app;
