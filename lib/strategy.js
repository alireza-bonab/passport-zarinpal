/**
 * Module dependencies.
 */
var uri = require('url'),
    util = require('util'),
    OAuth2Strategy = require('passport-oauth2'),
    InternalOAuthError = require('passport-oauth2').InternalOAuthError,
    ZarinpalAuthorizationError = require('./errors/zarinpalauthorizationerror'),
    ZarinpalTokenError = require('./errors/zarinpaltokenerror');


/**
 * `Strategy` constructor.
 *
 * The Zarinpal authentication strategy authenticates requests by delegating to
 * Zarinpal using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Zarinpal application's App ID
 *   - `clientSecret`  your Zarinpal application's App Secret
 *   - `callbackURL`   URL to which Zarinpal will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use( new BoomrangStrategy({
            clientID: 'boom_app_key',
            scope: '',
            bankId: default is 'ANSBIR',
            boomToken: token_you_got_from_boom_login,
            deviceId: 'device_id',
            clientSecret: 'boom_app_secret_key',
            callbackURL: 'http://localhost:3000/auth/zarinpal/callback'
        },
 function (accessToken, profile, done) {
                   // profile contains :
                   //    access-token,
                   //    refresh-token(if you have access),
                   //    scopes,
                   //    expiresIn( Token Expire Timte)
                }
 ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */


function Strategy(options, verify) {
    options = options || {};
    options.state = options.state || '1';
    options.clientID = options.clientID || '';
    options.clientSecret = options.clientSecret || '';
    options.authorizationURL = options.authorizationURL || 'https://connect.zarinpal.com/oauth/authorize';
    options.tokenURL = options.tokenURL || 'https://api.zarinpal.com/rest/v3/oauth/issueAccessToken.json';
    options.scope = options.scope || 'transaction transaction.read';
    options.scopeSeparator = options.scopeSeparator || ' ';
    options.callbackURL = options.callbackURL || 'http://localhost:3000/auth/zarinpal/callback';
    options.profileURL = options.profileURL || 'https://app.zarinpalboom.com:4432/v1/accounts';


    function customVerify(accessToken, refreshToken, params, profile, done) {

        var data = params.data;

        verify(data.access_token, data, done);
    };


    OAuth2Strategy.call(this, options, customVerify);
    this.name = 'zarinpal';
    this._clientSecret = options.clientSecret;

    this._options = options;
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Authenticate request by delegating to Zarinpal using OAuth 2.0.
 *
 * @param {Object} req
 * @param {Object} options
 * @api protected
 */
Strategy.prototype.authenticate = function (req, options) {
    // Zarinpal doesn't conform to the OAuth 2.0 specification, with respect to
    // redirecting with error codes.
    //
    //   FIX: https://github.com/jaredhanson/passport-oauth/issues/16
    if (req.query && req.query.error_code && !req.query.error) {
        return this.error(new ZarinpalAuthorizationError(req.query.error_message, parseInt(req.query.error_code, 10)));
    }


    OAuth2Strategy.prototype.authenticate.call(this, req, options);
};


/**
 * Parse error response from Zarinpal OAuth 2.0 token endpoint.
 *
 * @param {String} body
 * @param {Number} status
 * @return {Error}
 * @api protected
 */
Strategy.prototype.parseErrorResponse = function (body, status) {
    var json = JSON.parse(body);
    if (json.error && typeof json.error == 'object') {
        return new ZarinpalTokenError(json.error.message, json.error.type, json.error.code, json.error.error_subcode);
    }

    return OAuth2Strategy.prototype.parseErrorResponse.call(this, body, status);
};



/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
