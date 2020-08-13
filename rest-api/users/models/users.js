const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    email: String,
    password: String,
    projects: Array
}, { strict: false });

const Users = mongoose.model('users', usersSchema);

module.exports = Users;
