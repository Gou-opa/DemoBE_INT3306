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
            // user { username, bio, shopping cart, permission, draft input }
            req.session.username = username;
            return res.render("profile", {user: {username: user.username, password: user.password}, auth_token: authToken.token})
        } catch (err) {
            return res.json({success: false, message: "Invalid username/password"})
        }
    }

});
function checkRole(token){
    let role = AuthToken.findRole(token);
    let basedRoles = {
        admin: ['/user/create', "/user/delete", "/user/grantAdmin"],
        user: ['/user/update', "/self/delete"]
    }
    let result = []
    if role == user || role == admin:
        basedRoles.user.forEach(function (item){
            result.push(item)
        })
    if role == admin{
        basedRoles.admin.forEach(function (item){
            result.push(item)
        })
    }
    return result // ['/user/update', "/self/delete", '/user/create', "/user/delete", "/user/grantAdmin"]
}
function checkPermision(listAllowedPers, action) {
    // ['/user/update', "/self/delete", '/user/create', "/user/delete", "/user/grantAdmin"]
    return listAllowedPers.indexof(action)
    // if listAllowedPers.foreach(function (allowedAction){
    //     if (action == allowedAction){
    //         return true
    //     }
    // })
    // // nếu ko thoả mãn cái nào thì return false


}
dbuser = {username, pasword, allowed_apis=['/user/grant', ....]}
router.post("/api/order", function(req, res, next){
    let tokenString = req.headers.authorization; "Bearer r92yn92hrd92d29f9fs2h9fn24f282890s2r29ns"
    let [bearer, token] = tokenString.split(" ");
    let permissions = AuthToken.checkRole(username, token); // join bangr user-auth-role-permission
    // thêm giao diện tạo quyền cho user cha admin/user
    //
    if (checkPermision(permissions, req.path)){
        next()
    } else {
        res.status(403).json({"message": forbidden, action: req.path})
    }
}, function (req, res){
    //thực thi API
    //gọi axios tới API khác
    return res.json({})
})

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