'use strict';
import * as bcrypt from 'bcrypt'; // hashing library for passwords
import * as bodyParser from 'body-parser';
import * as  cors from 'cors';
import * as express from 'express';
import * as passport from 'passport';
import * as passportJwt from 'passport-jwt'
import * as LocalStrategy from 'passport-local'

import { secretKey } from '../config/secret'; // contains key of secret for decoding token
import { UserRouter } from './routes/UserRouter';
import { AppConstants } from './utils/AppConstants';

export const app = express();

const options:cors.CorsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: 'http://localhost:3000',
  };
// use cors middleware
app.use(cors(options));

const version = `v${AppConstants.API_VERSION}`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// passport authentication strategies

const jwtStrategy = passportJwt.Strategy;
const extractJwt = passportJwt.ExtractJwt;

// create local strategy

const localOptions = { usernameField: 'email'};

/**
 * Sign in using Email and Password.
 */

const localLogin = new LocalStrategy.Strategy(localOptions, (email, password, done) => {
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

// Default Route requires authorization
const router = express.Router();


router.get('/', (req, res) => res.json({
    message: 'Hello World'
}));


app.use('/', router);
