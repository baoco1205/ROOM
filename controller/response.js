const response = (res, data, message) => {
  console.log(message);
  res.json({
    message: message,
    success: true,
    data,
  });
};

const responseError = (res, error, statusCode) => {
  if (code) res.statusCode = code;
  else res.statusCode = 404;
  return res.json({
    success: false,
    ...error, // hay error đều được
  });
};

module.exports = { response: response, responseError: responseError };
