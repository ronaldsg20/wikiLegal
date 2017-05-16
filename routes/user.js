var mongoose = require('mongoose');

//User Schema
var userSchema = new mongoose.Schema({
  userName : {type:String, unique:true},
  psw : { type:String},
  name:String,
  UnCode:{type:String , unnique:true}
});

var User = mongoose.model("User",userSchema);

module.exports = User;
