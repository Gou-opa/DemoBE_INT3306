var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');

var basename  = path.basename(__filename);

var db        = {};

var sequelize = new Sequelize('mysql://uet:BMM_P1uDw@192.168.1.80:3306/uet')

// This gathers up all the model files we have yet to create, and
// puts them onto our db object, so we can use them in the rest
// of our application
fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// export the main sequelize package with an uppercase 'S' and
// our own sequelize instance with a lowercase 's'
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;