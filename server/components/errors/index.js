/**
 * Error responses
 */

'use strict';

module.exports[404] = (req, res) => {
  var viewFilePath = '404';
  var statusCode = 404;
  var result = {
    status: statusCode
  };

  res.status(result.status);
  res.render(viewFilePath, (err) => {
    if (err) { return res.json(result, result.status); }

    res.render(viewFilePath);
  });
};
