const mongoose = require('mongoose');

const db = {};
db.mongoose = mongoose;
db.url = 'mongodb+srv://RARA:gooddeedsRARA@6170proj.qgnmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//db.url = 'mongodb://localhost:27017/test';

module.exports = db;

