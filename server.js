const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const createError = require('http-errors');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');


const port = process.env.PORT || 3000;
const app = express();


app
  .use(bodyParser.json())
  .use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: true,
  }))

  // This is the basic express session ({...}) initialization.
  .use(passport.initialize())

  // init passport on every route call.
  .use(passport.session())

  // allow passport use to use "express-session"
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Heaters','Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    next();
  })
  .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
  .use(cors({ origin: '*'}))
  .use('/', require('./routes'));
  
 

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    return done(null, profile);
  // }) 
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user)
});

app.get('/', (req, res) => {res.send(req.session.user != undefined ? `Logged in as ${req.session.user.username}` : "Logged Out");
  console.log(req.session.user);
});


app.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs', session: false}),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  });
  
// Error 404
app.use((req, res, next) => {
  // const err = new Error('Not Found');
  // err.status = 404;
  // next(err);
  next(createError(404, 'Not found'));
  
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    } 
  });
});



mongodb.initDb((err) => {
if (err) {
    console.log(err);
} else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
}
});
  