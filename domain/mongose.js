var mongo = require('mongoose');
mongo.connect('mongodb://192.168.50.235/familynk');
global.db = mongo