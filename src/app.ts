'use strict';
import * as bcrypt from 'bcrypt'
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as passport from 'passport';
import * as passportJwt from 'passport-jwt'
import * as LocalStrategy from 'passport-local'

import { secretKey } from './../config/secret'; // contains key of secret for decoding token
import { UsersRouter } from './routes/UserRouter';
import { AppConstants } from './utils/AppConstants';

export const app = express();

const version = `v${AppConstants.API_VERSION}`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// passport authentication strategies

const jwtStrategy = passportJwt.Strategy;
const extractJwt = passportJwt.ExtractJwt; 

// create local strategy

const localOptions = {usernameField: 'email'}

const localLogin = new LocalStrategy.Strategy(localOptions, (email, password, done) => {
    return UsersRouter.verifyUser(email)
        .then((validUser) => {
            bcrypt.compare(password, validUser.password)
                .then((validPassword) => {
                    if(validPassword) {
                        return done(null, validUser)
                    }
                    return done(null, false)
                })
                .catch(err => done(err, false))
        })
})

// setup options for JWT strategy
const jwtOptions = {
    jwtFromRequest: extractJwt.fromHeader('authorization'),
    secretOrKey: secretKey.secret,
}

// create jwt Strategy 
const jwtLogin = new jwtStrategy(jwtOptions, (payload: any, done: any) => {
    return UsersRouter.findUserById(payload.sub)
        .then((foundUser) => {
            if(foundUser) {
                return done(null, foundUser)
            }
            return done(null, false)
        })
        .catch(err => done(err, false))
})
// tell passport to use this strategy
passport.use(jwtLogin)
passport.use(localLogin)

const requireAuth = passport.authenticate('jwt', {session: false})
// passport middleware. Session is set to false since JWT doesn't require sessions on the server
const requireSignIn = passport.authenticate('local', {session: false})
// GET Single User
app.get(`/api/${version}/users/:id`, UsersRouter.getUser);
// GET All Users
app.get(`/api/${version}/users`, UsersRouter.getAll);
// SignUp User
app.post(`/api/${version}/users`, UsersRouter.signUp)
// Login User
app.post(`/api/${version}/login`, UsersRouter.login)
// Events

// Default Route requires authorization 
const router = express.Router();
router.get('/', requireAuth,(req, res) => res.json({
    message: 'Hello World'
  }));
// login route requires authorization
router.post('/sign-in', requireSignIn, UsersRouter.login)

app.use('/', router);
