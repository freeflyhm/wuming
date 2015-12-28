var 
  mongoose     = require('mongoose'),
  WumingSchema = require('../schemas/wuming'),
  Wuming       = mongoose.model('Wuming', WumingSchema);

module.exports = Wuming;