var mongo = require('mongoose');
mongo.connect('mongodb://127.0.0.1/familynk');
global.db = mongo