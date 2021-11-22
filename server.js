const express = require('express')
var session = require('express-session');
const path = require("path");
const db = require('./models');

const app = express();
app.use(express.json()); // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'Ue1_F1T'
}));


const port = 13131;

app.use(express.static(__dirname + '/public'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require("./userController"));

app.get('/', (req, res) => {
    res.redirect('/login.html')
})


db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });
});