
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    // set up the associations 1-n User-AuthToken
    User.associate = function ({ AuthToken }) {
        User.hasMany(AuthToken);
    };

    // e.g. User.authenticate('user1', 'password1234')
    User.authenticate = async function(username, password) {
        const user = await User.findOne({ where: { username } });
        if (password == user.password) {
            return user.authorize();
        }
        throw new Error('Invalid password');
    }

    User.changePwd = async function(username, password, newPassword){
        try {
            const { user } = await User.authenticate(username, password);
            user.set({password: newPassword}); //update voi model
            await user.save();
            return await User.authenticate(username, newPassword);
        } catch (err){
            console.log(err);
            return {authToken: null}
        }
    }
    // in order to define an instance method, we have to access model prototype
    User.prototype.authorize = async function () {
        const { AuthToken } = sequelize.models;
        const user = this
        // create a new auth token associated to 'this' user
        // by calling the AuthToken class method we created earlier
        // and passing it the user id
        const authToken = await AuthToken.generate(this.id);

        // addAuthToken is a generated method provided by
        // sequelize which is made for any 'hasMany' relationships
        await user.addAuthToken(authToken);

        return { user, authToken }
    };

    return User;
};