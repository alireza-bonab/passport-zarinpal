# passport-zarinpal

[Passport](http://passportjs.org/) strategy for authenticating with [Zarinpal](Zarinpalboom.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Zarinpal in your Node.js applications.
By plugging into Passport, Zarinpal authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-zarinpal

## Usage

#### Configure Strategy

The Zarinpal authentication strategy authenticates users using a Zarinpal Core Banking
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying an app ID, app secret, callback URL.

    module.exports = new BoomrangStrategy({
            clientID: 'boom_app_key',
            scope: '',
            bankId: default is 'ANSBIR',
            boomToken: token_you_got_from_boom_login,
            deviceId: 'device_id',
            clientSecret: 'boom_app_secret_key',
            callbackURL: 'http://localhost:3000/auth/zarinpal/callback'
        },
        function (accessToken, profile, done) {
           // profile contains user profile also below items
           //    access-token, 
           //    refresh-token( If you have access to get refresh token ), 
           //    scopes, 
           //    tokenExpiresIn ( Token Expire Time )
        }
    );

#### Authenticate Requests

Use `'passport.authenticate()'`, specifying the `'zarinpal'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/zarinpal',
      passport.authenticate('zarinpal'));

    app.get('/auth/zarinpal/callback',
      passport.authenticate('zarinpal', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

It is possible to set bankId from url query--strings : 

    http://localhost:3000/auth/zarinpal?bank_id=CIYBIR


## Examples

For a complete, working example, refer to the [login example](https://github.comsunnystatue/passport-zarinpal/tree/master/examples/login).

## Tests

    $ npm install
    $ npm test

## Credits

  - [Alireza Alidoust](https://github.com/sunnystatue)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Alireza Alidoust
