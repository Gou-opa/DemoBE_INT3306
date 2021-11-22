module.exports = (sequelize, DataTypes) => {
    const AuthToken = sequelize.define('AuthToken', {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {});

    // set up the associations so we can make queries that include
    // the related objects 1-1
    AuthToken.associate = function({ User }) {
        AuthToken.belongsTo(User);
    };

    // generates a random 15 character token and
    // associates it with a user
    AuthToken.generate = async function(UserId) {
        if (!UserId) {
            throw new Error('AuthToken requires a user ID')
        }

        let token = '';

        const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 15; i++) {
            token += possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );
        }

        return AuthToken.create({ token, UserId })
    }
    AuthToken.logout = async function (token) {
        const authToken = await AuthToken.findOne({ where: { token } });
        return authToken.logout();
    }
    AuthToken.prototype.logout = async function () {
        const { AuthToken } = sequelize.models;
        const result = await AuthToken.destroy({ where: { token: this.token } });
        return result
    };
    return AuthToken;
};