var 
  mongoose     = require('mongoose'),
  Schema       = mongoose.Schema,
  ObjectId     = Schema.Types.ObjectId,
  WumingSchema = new Schema({
    name    : String,     // 'admin'      
    content : String
  });

module.exports = WumingSchema;