'use strict';
import * as bcrypt from 'bcrypt'; // hashing library for passwords
import * as bodyParser from 'body-parser';
<<<<<<< HEAD
import * as  cors from 'cors';
=======
>>>>>>> 93aafaa35619332d9e870838a2429cb9d76e51d6
import * as express from 'express';
import * as passport from 'passport';
import * as passportJwt from 'passport-jwt'
import * as LocalStrategy from 'passport-local'

<<<<<<< HEAD
import { secretKey } from '../config/secret'; // contains key of secret for decoding token
=======
import { EventRouter } from './routes/EventRouter';
>>>>>>> 93aafaa35619332d9e870838a2429cb9d76e51d6
import { UserRouter } from './routes/UserRouter';
import { AppConstants } from './utils/AppConstants';
import { envConfig } from './utils/envConfig'; // Environment-specific configuration

export const app = express();

<<<<<<< HEAD
const options:cors.CorsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: 'http://localhost:3000',
  };
// use cors middleware
app.use(cors(options));

const version = `v${AppConstants.API_VERSION}`;
=======
const prefix = envConfig.apiPrefix ? `${envConfig.apiPrefix}/v${AppConstants.API_VERSION}` : `v${AppConstants.API_VERSION}`;
>>>>>>> 93aafaa35619332d9e870838a2429cb9d76e51d6

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// passport authentication strategies

const jwtStrategy = passportJwt.Strategy;
const extractJwt = passportJwt.ExtractJwt;

// create local strategy

<<<<<<< HEAD
const localOptions = { usernameField: 'email'};
=======
const localOptions = { usernameField: 'email' };
>>>>>>> 93aafaa35619332d9e870838a2429cb9d76e51d6

/**
 * Sign in using Email and Password.
 */

const localLogin = new LocalStrategy.Strategy(localOptions, (email, password, done) => {
<<<<<<< HEAD
    return UserRouter.verifyUser(email)
        .then((validUser) => {
              bcrypt.compare(password, validUser.Password,)
                 .then((validPassword: boolean) => {
                    if (validPassword) {
                        return done(null, validUser)
                    }           
        return done(null, false)
    })
    .catch(err => done(err, false))
        });
});
=======
  return UserRouter.verifyUser(email)
    .then((dbUser) => {
      bcrypt.compare(password, dbUser.password)
        .then((validPassword: boolean) => {
          if (validPassword) {
            return done(null, dbUser)
          }
          return done(null, false)
        })
        .catch(err => done(err, false))
    });
});

// setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: envConfig.jwtSecretKey,
}

// create jwt Strategy
const jwtLogin = new jwtStrategy(jwtOptions, (payload: any, done: any) => {
  return UserRouter.findUserById(payload.sub)
    .then((foundUser) => {
      if (foundUser) {
        return done(null, foundUser)
      }
      return done(null, false)
    })
    .catch(err => done(err, false))
})
// tell passport to use this strategy
passport.use(jwtLogin)
passport.use(localLogin)

if (process.env.NODE_ENV === 'local') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  });
}

const requireAuth = passport.authenticate('jwt', { session: false })
// passport middleware. Session is set to false since JWT doesn't require sessions on the server
const requireSignIn = passport.authenticate('local', { session: false })
// GET Single User
app.get(`/${prefix}/users/:id`, UserRouter.getUser);
// GET All Users
app.get(`/${prefix}/users`, UserRouter.getAll);
// SignUp User
app.post(`/${prefix}/signUp`, UserRouter.signUp)
>>>>>>> 93aafaa35619332d9e870838a2429cb9d76e51d6

// setup options for JWT strategy
const jwtOptions = {
    jwtFromRequest: extractJwt.fromHeader('authorization'),
    secretOrKey: secretKey.secret,
}

// create jwt Strategy
const jwtLogin = new jwtStrategy(jwtOptions, (payload: any, done: any) => {
    return UserRouter.findUserById(payload.sub)
        .then((foundUser) => {
            if (foundUser) {
                return done(null, foundUser)
            }
            return done(null, false)
        })
        .catch(err => done(err, false))
})
// tell passport to use this strategy
passport.use(jwtLogin)
passport.use(localLogin)
// protecting routes using passport
// const requireAuth = passport.authenticate('jwt', { session: false })
// passport middleware. Session is set to false since JWT doesn't require sessions on the server
const requireSignIn = passport.authenticate('local', { session: false })
// options for cors middleware

// GET Single User
app.get(`/api/${version}/users/:id`, UserRouter.getUser);
// GET All Users
app.get(`/api/${version}/users`, UserRouter.getAll);
// SignUp User
app.post(`/api/${version}/signUp`, UserRouter.signUp)
// Login User that requires authentication
app.post(`/api/${version}/login`, requireSignIn, UserRouter.login)
// Events
app.get(`/${prefix}/events`, EventRouter.getEvents)

// Default Route requires authorization
const router = express.Router();
<<<<<<< HEAD


router.get('/', (req, res) => res.json({
    message: 'Hello World'
}));

=======
router.get('/', requireAuth, (req, res) => res.json({
  message: 'Hello World'
}));
router.get('/hello-world', (req, res) => res.json({
  message: 'Hello World'
}));
// Login User that requires authentication
router.post(`/${prefix}/login`, requireSignIn, UserRouter.login)
>>>>>>> 93aafaa35619332d9e870838a2429cb9d76e51d6

app.use('/', router);
