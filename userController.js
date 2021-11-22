const express = require('express');
const router = express.Router();

const { User, AuthToken } = require('./models'); //auto import index.js file as es6 syntax

// const cors = require("cors");
// var corsOptions = {
//     origin: "http://localhost:13131"
// };
// router.use(cors(corsOptions));

router.post('/register', async (req, res) => { //create
    try {
        await User.create(req.body) //insert
        return res.redirect("/login.html")
    } catch (err) {
        return res.json({success:false, error: err})
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password){
        return res.json({success: false, message: "Missing username/password"})
    } else {
        try {
            let {user, authToken} = await User.authenticate(username, password);
            req.session.username = username;
            return res.render("profile", {user: {username: user.username, password: user.password}, auth_token: authToken.token})
        } catch (err) {
            return res.json({success: false, message: "Invalid username/password"})
        }
    }

});

router.get('/logout', async (req, res) => {
    let token = req.query.token;
    if(token.length === 15){
        let result = await AuthToken.logout(token);

    } else {
        return res.status(400).send("Invalid token");
    }
});

router.post("/change-password", async (req, res) => {
    let username = req.session.username;
    let {password,npassword} = req.body;
    let {user, authToken} = await User.changePwd(username, password, npassword)
    return res.render("profile", {user:{username: user.username, password: npassword}, auth_token: authToken.token})
});

router.get('/profile', (req, res)=> {
    res.render("profile", {user: {username: "ABC", password: "1234"} , auth_token: "d79h279h29dh9d239d"} )
});

module.exports = router;