module.exports = {
  rand: function (limit, method) {
    var method = method || 'floor';
    return Math[method](Math.random() * limit);
  }
};
