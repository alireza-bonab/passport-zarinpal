/**
 * `ZarinpalAuthorizationError` error.
 *
 * ZarinpalAuthorizationError represents an error in response to an
 * authorization request on Zarinpal.  Note that these responses don't conform
 * to the OAuth 2.0 specification.
 *
 * References:
 *   - None
 *
 * @constructor
 * @param {String} [message]
 * @param {Number} [code]
 * @api public
 */
function ZarinpalAuthorizationError(message, code) {
	Error.call(this);
	Error.captureStackTrace(this, arguments.callee);
	this.name = 'ZarinpalAuthorizationError';
	this.message = message;
	this.code = code;
	this.status = 500;
}

/**
 * Inherit from `Error`.
 */
ZarinpalAuthorizationError.prototype.__proto__ = Error.prototype;


/**
 * Expose `ZarinpalAuthorizationError`.
 */
module.exports = ZarinpalAuthorizationError;
