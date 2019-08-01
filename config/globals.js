// var url = require("url");
// var User = require("../model/user");

/**
 * Escapes a given string for use in a regex expression
 * @param {string} s
 */
var regexEscape = (exports.regexExcape = s => {
  if (!RegExp.escape) {
    RegExp.escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }
  return RegExp.escape(s);
});

/**
 * Gets the session uid from the request
 * @param {Request} req
 */
// var getUid = (exports.uid = req => {
//   try {
//     return req.session.passport.user;
//   } catch (error) {
//     return null;
//   }
// });

/**
 * Removes sensitive data from a User object before sending it to the client
 * @param {Response} res
 * @param {User} user
 */
// var safelySendUser = (exports.safelySendUser = (res, user) => {
//   try {
//     let resUser = Object.assign({}, user)._doc;
//     resUser.uid = resUser._id;
//     delete resUser.password;
//     delete resUser._id;
//     delete resUser.__v;
//     res.send(resUser);
//   } catch (error) {
//     errorInternal("Failed to safely send user", null, res);
//   }
// });

/**
 * Ensures the request is from an authenticated user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
// exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   else {
//     res.redirect(
//       "/user/login?r=" + encodeURIComponent(url.parse(req.originalUrl).href)
//     );
//   }
// };

/**
 * Checks if the specified param exists, if it doesn't an error response is sent
 * @param {*} param
 * @param {Response} res
 * @param {string} [name] name of the param e.g.) 'uid'
 * @param {Number} [statusCode]
 */
exports.checkParamExists = function checkParamExists(
  param,
  res,
  name,
  statusCode
) {
  if (!!!param) {
    if (!name) {
      name = "Missing parameter";
    } else {
      name = "Missing parameter '" + name + "'";
    }
    if (!statusCode) statusCode = 400;
    res.status(statusCode).send(errorResponse(statusCode, name));
    return false;
  }
  return true;
};

/**
 * Returns a unified error reponse structure for http(s) requests
 * @param {Number|String} statusCode
 * @param {String} [description]
 * @param {Object} [data]
 * @param {Response} [res]
 */
var errorResponse = (exports.errorResponse = (
  statusCode,
  description,
  data,
  res
) => {
  let json = {
    status: statusCode,
    message: description,
    data: data
  };
  if (typeof data == "boolean") data = null;
  if (res) res.status(statusCode).send(json);
  return json;
});

/**
 * Returns a unified error object structure for internal handlers
 * @param {String} description
 * @param {Object} [data]
 * @param {Response} [res]
 */
var errorInternal = (exports.errorInternal = function errorInternal(
  description,
  data,
  res
) {
  let json = {
    message: description,
    data: data,
    code: 500
  };
  if (res) res.status(500).send(json);
  return json;
});

/**
 * Basic callback for most functions
 * @callback Callback
 * @param {Object} err
 * @param {Object} data
 */
