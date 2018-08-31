'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.User= require('./User')(db.sequelize, db.Sequelize);
// db.Client= require('./Client')(db.sequelize, db.Sequelize);
// db.ICOSiteConfig= require('./ICOSiteConfig')(db.sequelize, db.Sequelize);
// db.Currency= require('./Currency')(db.sequelize, db.Sequelize);
// db.UserCurrencyAddress= require('./UserCurrencyAddress')(db.sequelize, db.Sequelize);
// db.UserCurrencyBalance= require('./UserCurrencyBalance')(db.sequelize, db.Sequelize);
// db.UserType= require('./UserType')(db.sequelize, db.Sequelize);
// db.Package= require('./Package')(db.sequelize, db.Sequelize);
// db.ClientPackage=require('./ClientPackage')(db.sequelize, db.Sequelize);

module.exports = db;
