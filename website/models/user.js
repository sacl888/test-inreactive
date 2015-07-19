var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	firstname: String,
	lastname: String,
	phone: String,
	starttime: {
		type: Date
	},
	admin: { type: Boolean },
	online: {
		type: Number, 
		default: 0
	} 
});

var Users = mongoose.model('User', userSchema);

module.exports = Users