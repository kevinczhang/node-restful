var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BearSchema = new Schema({
    name: String,
    level: String,
    description: String
});

module.exports = mongoose.model('Bear', BearSchema);