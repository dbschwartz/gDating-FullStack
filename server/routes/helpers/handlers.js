function success (res, status) {
  var status = status || 200;
  return function (response) {
    res.status(status).send({ data: response });
  }
}

function error (res, status) {
  var status = status || 200;
  return function (response) {
    if ( response.errors ) {
      for ( var error in response.errors ) {
        delete response.errors[error].properties;
      }

      response = response.errors;
    } else {
      response = "Something went wrong with your request. Sorry, but we " +
                 "don't have more information than that."
    }
    res.status(status).send({ errors: response });
  }
}

module.exports = {
  success: success,
  error: error
}
